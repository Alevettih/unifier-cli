import { existsSync, copy, outputFile, readFileSync, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { blue, red } from 'colors/safe';
import { command, ExecaReturnValue, Options } from 'execa';
import { newlineSeparatedValue, arrayMerge, IS_WINDOWS } from '@utils/helpers';
import * as deepMerge from 'deepmerge';
import { Listr, ListrTask } from 'listr2';

export interface ConfigPaths {
  src: string;
  dist: string;
}

export class Specifier {
  readonly project: string;
  readonly version: string;
  readonly childProcessOptions: Options;

  constructor(project: string, version?: string) {
    if (!project) {
      throw new Error('Target directory is required!');
    }

    this.project = project;
    this.version = version;
    this.childProcessOptions = { shell: true, cwd: join(project) };
  }

  get name(): string {
    return this.project;
  }

  copyConfigs(...paths: ConfigPaths[]): Listr {
    return new Listr(
      paths.map(
        (path: ConfigPaths): ListrTask => {
          const pathArray = path.src.split('/');
          const file = pathArray[pathArray.length - 1];
          return {
            title: `Copy ${blue(file)} file`,
            task: () => copy(path.src, path.dist)
          };
        }
      )
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
      readFileSync(join(__dirname, '../../specification/files/.gitignore.example'), 'utf-8')
    );

    return outputFile(
      join(this.name, '.gitignore'),
      newlineSeparatedValue.stringify(deepMerge(projectGitignore, specificationGitignore, { arrayMerge })),
      'utf-8'
    ).catch(err => {
      throw new Error(red(`.gitignore update failed: ${err}`));
    });
  }

  installPackages(dependencies = [] as string[], devDependencies = [] as string[]): Listr {
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
        enabled: ctx => ctx.usedPackageManager !== 'npm' && ctx.yarn,
        task: () =>
          command(
            `yarn ${devDependenciesString.length ? `add ${devDependenciesString} --dev` : 'install'}`,
            this.childProcessOptions
          ).then(() =>
            command(
              `yarn ${dependenciesString.length ? `add ${dependenciesString}` : 'install'}`,
              this.childProcessOptions
            )
          )
      },
      {
        title: 'Install dependencies by npm',
        enabled: ctx => ctx.npm || !ctx.yarn,
        task: () =>
          command(
            `npm ${devDependenciesString.length ? `i ${devDependenciesString} --save-dev` : 'i'}`,
            this.childProcessOptions
          ).then(() =>
            command(`npm ${dependenciesString.length ? `i ${dependenciesString}` : 'i'}`, this.childProcessOptions)
          )
      }
    ]);
  }

  async removeDefaultGit(): Promise<ExecaReturnValue> {
    const rmCommand: string = IS_WINDOWS ? 'del' : 'rm -rf';
    return command(`${rmCommand} .git`, this.childProcessOptions);
  }

  async initGit(): Promise<ExecaReturnValue> {
    return command('git init', Object.assign({ shell: true }, this.childProcessOptions));
  }

  async initialCommit(amend?: boolean): Promise<ExecaReturnValue> {
    return command(`git add .&& git commit -m "Initial commit" -n${amend ? ` --amend` : ''}`, this.childProcessOptions);
  }

  isYarnAvailable(ctx): Promise<void> {
    return command(`npm list -g --json`, this.childProcessOptions).then(
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

  usedPackageManager(ctx): void {
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
      Object.assign({ preferLocal: true }, this.childProcessOptions)
    );
  }

  lintersTask(): Listr {
    return new Listr(
      [
        { title: 'Get Available linters', task: ctx => this.getLinters(ctx) },
        {
          title: 'Fix linting errors, if possible',
          skip: ctx => !ctx.lintersKeys.length,
          task: ctx => this.runLinters(ctx)
        }
      ],
      { exitOnError: false }
    );
  }

  getLinters(ctx): void {
    const json = readJsonSync(join(this.name, 'package.json'));
    ctx.lintersKeys = Object.keys(json.scripts).filter(
      (key: string): boolean => key.includes('lint') && !/:(all|watch)/g.test(key)
    );
  }

  runLinters(ctx): Listr {
    return new Listr(
      ctx.lintersKeys.map(linter => ({
        title: `Run ${linter}`,
        task: () =>
          command(`npm run ${linter}`, this.childProcessOptions).catch(() => {
            throw new Error(red('Linting failed, please fix linting problems manually'));
          })
      }))
    );
  }
}
