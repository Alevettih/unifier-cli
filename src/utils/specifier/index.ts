import { copy, outputFile, readFileSync, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { green, red, yellow } from 'colors/safe';
import { command, ExecaReturnValue, Options } from 'execa';
import { newlineSeparatedValue, arrayMerge } from '@utils/helpers';
import * as deepMerge from 'deepmerge';

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
    this.childProcessOptions = { shell: true, cwd: join(project), stdio: 'inherit' };
  }

  get name(): string {
    return this.project;
  }

  copyConfigs(...paths: ConfigPaths[]): Promise<void> {
    return Promise.all(paths.map((path: ConfigPaths): Promise<void> => copy(path.src, path.dist))).then(
      () => {
        console.log(green('Configs successfully copied!'));
      },
      err => {
        throw new Error(red(`Config copying failed: ${err}`));
      }
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
    ).then(
      () => {
        console.log(green('JSON successfully updated!'));
      },
      err => {
        throw new Error(red(`JSON update failed: ${err}`));
      }
    );
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
    ).then(
      () => {
        console.log(green('.gitignore successfully updated!'));
      },
      err => {
        throw new Error(red(`.gitignore update failed: ${err}`));
      }
    );
  }

  async installPackages(modules = [] as string[]) {
    let process;
    const modulesString = modules && modules.length ? modules.join(' ') : '';

    if ((await this.usedPackageManager()) !== 'npm' && (await this.isYarnAvailable())) {
      console.log(yellow('Use yarn'));

      process = command(
        `yarn ${modulesString.length ? `add ${modulesString} --dev` : 'install'}`,
        this.childProcessOptions
      );
    } else {
      console.log(yellow('Use npm'));

      process = command(
        `npm ${modulesString.length ? `i ${modulesString} --save-dev` : 'i'}`,
        this.childProcessOptions
      );
    }

    try {
      await process;
      console.log(green('Modules successfully installed!'));
    } catch ({ message }) {
      throw new Error(red(`Modules installation failed: ${message}`));
    }
  }

  async removeDefaultGit(): Promise<void> {
    const process = command('rm -rf .git', this.childProcessOptions);

    try {
      await process;
      console.log(green('Default Git removed'));
    } catch ({ message }) {
      throw new Error(red(`Default Git removing error: ${message}`));
    }
  }

  async initGit() {
    const process = command('git init', Object.assign({ shell: true }, this.childProcessOptions));

    try {
      await process;
      console.log(green('Git repository successfully initiated!'));
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
      console.log(green('initial commit was successfully done!'));
    } catch ({ message }) {
      throw new Error(red(`Initial commit error: ${message}`));
    }
  }

  addConfigJs(): Promise<void> {
    return outputFile(
      join(this.name, 'public/config.js'),
      '// eslint-disable-next-line no-underscore-dangle\n(window || global).__ENV__ = Object.freeze({\n\n});',
      'utf-8'
    ).then(
      () => {
        console.log(green('config.js successfully created!'));
      },
      err => {
        throw new Error(red(`config.js creation failed: ${err}`));
      }
    );
  }

  addLinkToConfigJsInHtml(): Promise<void> {
    const html: string = readFileSync(join(this.name, 'public/index.html'), 'utf-8');

    return outputFile(
      join(this.name, 'public/index.html'),
      html.replace('</title>', '</title>\n    <script src="./config.js"></script>'),
      'utf-8'
    ).then(
      () => {
        console.log(green('index.html successfully updated!'));
      },
      err => {
        throw new Error(red(`index.html update failed: ${err}`));
      }
    );
  }

  async isYarnAvailable(): Promise<boolean> {
    const process = command(`npm list -g --depth=0 | grep yarn`, this.childProcessOptions);

    try {
      await process;
      console.log(yellow(`yarn found.`));
      return true;
    } catch ({ message }) {
      console.log(yellow(`yarn is not found.`));
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

    console.log(yellow(`Currently used package manager is ${result}`));
    return result;
  }
}
