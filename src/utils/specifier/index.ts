import { existsSync, copy, outputFile, readFileSync, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { cyan, red } from 'ansi-colors';
import { command, ExecaReturnValue, Options } from 'execa';
import { newlineSeparatedValue, arrayMerge, IS_WINDOWS } from '@utils/helpers';
import * as deepMerge from 'deepmerge';
import { Listr, ListrTask } from 'listr2';
import { IAnswer } from '@src/main';

export interface IConfigPaths {
  src: string;
  dist: string;
}

export interface IContext {
  yarn: boolean;
  usedPackageManager: 'yarn' | 'npm';
  lintersKeys: string[];
}

export const configsDir: string = './configs/';

export class Specifier {
  readonly FORCE_NPM: boolean;
  readonly SKIP_GIT: boolean;
  readonly PROJECT: string;
  readonly VERSION: string;
  readonly CHILD_PROCESS_OPTIONS: Options;

  constructor({ title, version, 'skip-git': skipGit, 'force-npm': forceNpm }: IAnswer) {
    if (!title) {
      throw new Error('Target directory is required!');
    }

    this.PROJECT = title;
    this.VERSION = version;
    this.SKIP_GIT = skipGit ?? false;
    this.FORCE_NPM = forceNpm ?? false;
    this.CHILD_PROCESS_OPTIONS = { shell: true, cwd: join(title) };
  }

  get name(): string {
    return this.PROJECT;
  }

  copyConfigs(...paths: IConfigPaths[]): Listr {
    return new Listr(
      paths.map((path: IConfigPaths): ListrTask => {
        const pathArray = path.src.split(IS_WINDOWS ? '\\' : '/');
        const file = pathArray[pathArray.length - 1];
        return {
          title: `Copy ${cyan(file)} file`,
          task: () => copy(path.src, path.dist)
        };
      })
    );
  }

  mergeWithJson(pathToJson: string, objToMerge: object): Promise<void> {
    const json = readJsonSync(pathToJson);
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

  updateGitignoreRules(): Promise<void> {
    const projectGitignore: object = newlineSeparatedValue.parse(readFileSync(join(this.name, '.gitignore'), 'utf-8'));
    const specificationGitignore: object = newlineSeparatedValue.parse(
      readFileSync(join(__dirname, './configs/.gitignore.example'), 'utf-8')
    );

    return outputFile(
      join(this.name, '.gitignore'),
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
        title: 'Check currently used package manager',
        task: ctx => this.usedPackageManager(ctx)
      },
      {
        title: 'Check yarn availability',
        skip: ctx => ctx.usedPackageManager === 'npm',
        task: ctx => this.isYarnAvailable(ctx)
      },
      {
        title: 'Install dependencies by yarn',
        enabled: ctx => !this.FORCE_NPM && ctx.usedPackageManager !== 'npm' && ctx.yarn,
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
        title: 'Install dependencies by npm',
        enabled: ctx => this.FORCE_NPM || ctx.npm || !ctx.yarn,
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
    const rmCommand: string = IS_WINDOWS ? 'del' : 'rm -rf';
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

  isYarnAvailable(ctx: IContext): Promise<void> {
    return command(`npm list -g --json`, this.CHILD_PROCESS_OPTIONS).then(
      (result: ExecaReturnValue<any>) => {
        const jsonStr: string = result?.stdout;
        const json: any = jsonStr ? JSON.parse(jsonStr) : { dependencies: {} };
        ctx.yarn = Object.keys(json.dependencies).includes('yarn');
      },
      () => {
        ctx.yarn = false;
      }
    );
  }

  usedPackageManager(ctx: IContext): void {
    ctx.usedPackageManager = null;

    if (existsSync(join(this.name, 'package-lock.json'))) {
      ctx.usedPackageManager = 'npm';
    }

    if (existsSync(join(this.name, 'yarn.lock'))) {
      ctx.usedPackageManager = 'yarn';
    }
  }

  runPrettier(): Promise<ExecaReturnValue<string>> {
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
    const json = readJsonSync(join(this.name, 'package.json'));
    ctx.lintersKeys = Object.keys(json.scripts).filter(
      (key: string): boolean => key.includes('lint') && !/:(all|watch)/g.test(key)
    );
  }

  runLinters(ctx: IContext): Listr {
    return new Listr(
      ctx.lintersKeys.map(linter => ({
        title: `Run ${linter}`,
        task: () =>
          command(`npm run ${linter}`, this.CHILD_PROCESS_OPTIONS).catch(() => {
            throw new Error(red('Linting failed, please fix linting problems manually'));
          })
      }))
    );
  }
}
