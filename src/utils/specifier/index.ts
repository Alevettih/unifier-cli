import { existsSync, copy, outputFile, readFileSync, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { blue, red } from 'colors/safe';
import { command, ExecaReturnValue, Options } from 'execa';
import { newlineSeparatedValue, arrayMerge } from '@utils/helpers';
import * as deepMerge from 'deepmerge';
import * as Listr from 'listr';
import { ListrTask } from 'listr';
export interface ConfigPaths {
  src: string;
  dist: string;
}

export class Specifier {
  readonly project: string;
  readonly childProcessOptions: Options;

  constructor(project: string) {
    if (!project) {
      throw new Error('Target directory is required!');
    }

    this.project = project;
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
      readFileSync(join(__dirname, '../../specification/files/.gitignore'), 'utf-8')
    );

    return outputFile(
      join(this.name, '.gitignore'),
      newlineSeparatedValue.stringify(deepMerge(projectGitignore, specificationGitignore, { arrayMerge })),
      'utf-8'
    ).catch(err => {
      throw new Error(red(`.gitignore update failed: ${err}`));
    });
  }

  installPackages(modules = [] as string[]): Listr {
    const modulesString = modules && modules.length ? modules.join(' ') : '';
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
          command(`yarn ${modulesString.length ? `add ${modulesString} --dev` : 'install'}`, this.childProcessOptions)
      },
      {
        title: 'Install dependencies by npm',
        enabled: ctx => ctx.npm || !ctx.yarn,
        task: () =>
          command(`npm ${modulesString.length ? `i ${modulesString} --save-dev` : 'i'}`, this.childProcessOptions)
      }
    ]);
  }

  async removeDefaultGit(): Promise<ExecaReturnValue> {
    return command('rm -rf .git', this.childProcessOptions).catch(({ message }) => {
      throw new Error(red(`Default Git removing error: ${message}`));
    });
  }

  async initGit(): Promise<ExecaReturnValue> {
    return command('git init', Object.assign({ shell: true }, this.childProcessOptions)).catch(({ message }) => {
      throw new Error(red(`Git init error: ${message}`));
    });
  }

  async initialCommit(amend?: boolean): Promise<ExecaReturnValue> {
    return command(
      `git add .; git commit -m "Initial commit" -n${amend ? ` --amend` : ''}`,
      this.childProcessOptions
    ).catch(({ message }) => {
      throw new Error(red(`Initial commit error: ${message}`));
    });
  }

  addConfigJs(): Promise<void> {
    return outputFile(
      join(this.name, 'public/config.js'),
      '// eslint-disable-next-line no-underscore-dangle\n(window || global).__ENV__ = Object.freeze({\n\n});',
      'utf-8'
    ).catch(err => {
      throw new Error(red(`config.js creation failed: ${err}`));
    });
  }

  addLinkToConfigJsInHtml(): Promise<void> {
    const html: string = readFileSync(join(this.name, 'public/index.html'), 'utf-8');

    return outputFile(
      join(this.name, 'public/index.html'),
      html.replace('</title>', '</title>\n    <script src="./config.js"></script>'),
      'utf-8'
    ).catch(err => {
      throw new Error(red(`index.html update failed: ${err}`));
    });
  }

  isYarnAvailable(ctx): Promise<void> {
    return command(`npm list -g --depth=0 | grep yarn`, this.childProcessOptions).then(
      () => {
        ctx.yarn = true;
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

  lintersTask() {
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

  getLinters(ctx) {
    const json = readJsonSync(join(this.name, 'package.json'));
    ctx.lintersKeys = Object.keys(json.scripts).filter(
      (key: string): boolean => key.includes('lint') && !/:(all|watch)/g.test(key)
    );
  }

  runLinters(ctx) {
    return new Listr(
      ctx.lintersKeys.map(linter => ({
        title: `Run ${linter}`,
        task: () =>
          command(`npm run ${linter}`, this.childProcessOptions).catch(err => {
            throw new Error(red('Linting failed, please fix linting problems manually'));
          })
      }))
    );
  }
}
