import { copy, outputFile, readFileSync, readJsonSync, writeJson } from 'fs-extra';
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

export type PackageManager = 'npm' | 'yarn' | null;

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
        arrayMerge(target: any[], source: any[]): any[] {
          return source;
        }
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

  async installPackages(modules = [] as string[]) {
    let process;
    const modulesString = modules && modules.length ? modules.join(' ') : '';

    if ((await this.usedPackageManager()) !== 'npm' && (await this.isYarnAvailable())) {
      process = command(
        `yarn ${modulesString.length ? `add ${modulesString} --dev` : 'install'}`,
        this.childProcessOptions
      );
    } else {
      process = command(
        `npm ${modulesString.length ? `i ${modulesString} --save-dev` : 'i'}`,
        this.childProcessOptions
      );
    }

    try {
      await process;
    } catch ({ message }) {
      throw new Error(red(`Modules installation failed: ${message}`));
    }
  }

  async removeDefaultGit(): Promise<void> {
    const process = command('rm -rf .git', this.childProcessOptions);

    try {
      await process;
    } catch ({ message }) {
      throw new Error(red(`Default Git removing error: ${message}`));
    }
  }

  async initGit() {
    const process = command('git init', Object.assign({ shell: true }, this.childProcessOptions));

    try {
      await process;
    } catch ({ message }) {
      throw new Error(red(`Git init error: ${message}`));
    }
  }

  async initialCommit(amend?: boolean) {
    const process = command(
      `git add .; git commit -m "Initial commit" -n${amend ? ` --amend` : ''}`,
      this.childProcessOptions
    );

    try {
      await process;
    } catch ({ message }) {
      throw new Error(red(`Initial commit error: ${message}`));
    }
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

  async isYarnAvailable(): Promise<boolean> {
    const process = command(`npm list -g --depth=0 | grep yarn`, this.childProcessOptions);

    try {
      await process;
      return true;
    } catch ({ message }) {
      return false;
    }
  }

  async usedPackageManager(): Promise<PackageManager> {
    const options = Object.assign({ reject: false }, this.childProcessOptions);
    const yarn = command(`ls -la | grep yarn.lock`, options);
    const npm = command(`ls -la | grep package-lock.json`, options);
    const promiseResult = await Promise.all([npm, yarn]);
    let result: PackageManager = null;

    promiseResult.forEach(({ exitCode, command: cmd }: ExecaReturnValue) => {
      if (exitCode) {
        return;
      }

      result = cmd.includes('yarn.lock') ? 'yarn' : 'npm';
    });

    return result;
  }
}
