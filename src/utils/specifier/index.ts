import { existsSync, copy, outputFile, readFileSync, readJsonSync, removeSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { cyan, red } from 'ansi-colors';
import { command, ExecaReturnValue, Options } from 'execa';
import * as deepMerge from 'deepmerge';
import { Listr, ListrTask } from 'listr2';
import { IContext } from '@src/main';
import mustache, { Context } from 'mustache';
import { shouldUseYarn } from '@utils/helpers/verifications/should-use-yarn.helper';
import { deepDelete } from '@utils/helpers/data-structure-manipulation/deep-delete.helper';
import { arrayMerge } from '@utils/helpers/data-structure-manipulation/array-merge.helper';
import { newlineSeparatedValue } from '@utils/helpers/newline-separated-value.helper';

export interface IPaths {
  src: string;
  dist: string;
}

export class Specifier {
  static readonly IS_WINDOWS: boolean = process.platform === 'win32';
  static readonly TEMPLATES_DIR: string = './templates/';
  static readonly CONFIGS_DIR: string = './configs/';
  private _ctx: IContext;
  readonly CHILD_PROCESS_OPTIONS: Options;

  constructor(ctx: IContext) {
    if (!ctx.title) {
      throw new Error('Target directory is required!');
    }

    this._ctx = ctx;
    this.CHILD_PROCESS_OPTIONS = { shell: true, cwd: join(ctx.title) };
  }

  copyConfigs(...paths: IPaths[]): Listr {
    return new Listr(
      paths.map((path: IPaths): ListrTask => {
        const pathArray = path.src.split(Specifier.IS_WINDOWS ? '\\' : '/');
        const file = pathArray[pathArray.length - 1];
        return {
          title: `Copy ${cyan(file)} file`,
          task: () => copy(path.src, path.dist)
        };
      }),
      { concurrent: true }
    );
  }

  mergeWithJson(pathToJson: string, objToMerge: object, fieldsToRemove: string[] = []): Promise<void> {
    const json = readJsonSync(pathToJson);

    for (const fieldPath of fieldsToRemove) {
      deepDelete(fieldPath, json);
    }

    return writeJson(
      pathToJson,
      deepMerge(json, objToMerge, {
        arrayMerge: (target: any[], source: any[]): any[] => source
      }),
      { spaces: 2 }
    ).catch(err => {
      throw new Error(red(`JSON update failed: ${err}`));
    });
  }

  updateGitignoreRules({ title }: IContext): Promise<void> {
    const projectGitignore: object = newlineSeparatedValue.parse(readFileSync(join(title, '.gitignore'), 'utf-8'));
    const specificationGitignore: object = newlineSeparatedValue.parse(
      readFileSync(join(__dirname, './configs/.gitignore.example'), 'utf-8')
    );

    return outputFile(
      join(title, '.gitignore'),
      newlineSeparatedValue.stringify(deepMerge(projectGitignore, specificationGitignore, { arrayMerge })),
      'utf-8'
    ).catch(err => {
      throw new Error(red(`.gitignore update failed: ${err}`));
    });
  }

  installPackages(dependencies: string[] = [], devDependencies: string[] = []): Listr {
    const dependenciesString = dependencies && dependencies.length ? dependencies.join(' ') : '';
    const devDependenciesString = devDependencies && devDependencies.length ? devDependencies.join(' ') : '';
    return new Listr([
      {
        enabled: shouldUseYarn,
        task: () =>
          command(
            `yarn ${devDependenciesString.length ? `add ${devDependenciesString} --dev` : 'install'}`,
            this.CHILD_PROCESS_OPTIONS
          ).then(() =>
            command(
              `yarn ${dependenciesString.length ? `add ${dependenciesString}` : 'install'}`,
              this.CHILD_PROCESS_OPTIONS
            )
          )
      },
      {
        enabled: (ctx: IContext) => !shouldUseYarn(ctx),
        task: () =>
          command(
            `npm ${devDependenciesString.length ? `i ${devDependenciesString} --save-dev` : 'i'}`,
            this.CHILD_PROCESS_OPTIONS
          ).then(() =>
            command(`npm ${dependenciesString.length ? `i ${dependenciesString}` : 'i'}`, this.CHILD_PROCESS_OPTIONS)
          )
      }
    ]);
  }

  async removeDefaultGit(): Promise<ExecaReturnValue> {
    const rmCommand: string = Specifier.IS_WINDOWS ? 'del' : 'rm -rf';
    return command(`${rmCommand} .git`, this.CHILD_PROCESS_OPTIONS);
  }

  async initGit(): Promise<ExecaReturnValue> {
    return command('git init', Object.assign({ shell: true }, this.CHILD_PROCESS_OPTIONS));
  }

  async initialCommit(amend?: boolean): Promise<ExecaReturnValue> {
    return command(
      `git add .&& git commit -m "Initial commit" -n${amend ? ` --amend` : ''}`,
      this.CHILD_PROCESS_OPTIONS
    );
  }

  applyTemplates(paths: IPaths[], view: any | Context): Promise<void> {
    return Promise.all(
      paths.map(({ src, dist }: IPaths): Promise<void> => {
        const template: string = readFileSync(src)?.toString();
        const content: string = mustache.render(template, view);
        return outputFile(dist, content);
      })
    ).then(() => null);
  }

  removeFiles(...files: string[]): void {
    files.forEach(path => existsSync(path) && removeSync(path));
  }

  runPrettier(): Promise<ExecaReturnValue> {
    return command(
      'node ./node_modules/prettier/bin-prettier "./src/**/*.{js,jsx,ts,tsx,html,vue}" --write',
      Object.assign({ preferLocal: true }, this.CHILD_PROCESS_OPTIONS)
    );
  }

  lintersTask(): Listr {
    return new Listr(
      [
        { title: 'Get Available linters', task: (ctx: IContext) => this.getLinters(ctx) },
        {
          title: 'Fix linting errors, if possible',
          skip: (ctx: IContext) => !ctx.lintersKeys.length,
          task: (ctx: IContext) => this.runLinters(ctx)
        }
      ],
      { exitOnError: false }
    );
  }

  getLinters(ctx: IContext): void {
    const json = readJsonSync(join(ctx.title, 'package.json'));
    ctx.lintersKeys = Object.keys(json.scripts).filter(
      (key: string): boolean => key.includes('lint') && !/:(all|watch)/g.test(key)
    );
  }

  runLinters(ctx: IContext): Listr {
    return new Listr(
      ctx.lintersKeys.map(linter => ({
        title: `Run ${cyan(linter)}`,
        task: () =>
          command(`npm run ${linter}`, this.CHILD_PROCESS_OPTIONS).catch(() => {
            throw new Error(red('Linting failed, please fix linting problems manually'));
          })
      }))
    );
  }
}
