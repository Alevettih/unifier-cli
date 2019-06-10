import { copy, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { ChildProcess, spawn } from 'child_process';
import { PackageJson } from 'tsconfig-paths/lib/filesystem';
import { green, red } from 'colors/safe';
import { childProcessPromise } from '@utils/helpers';

export interface LinterConfig {
  modules: string[];
  script: string;
  path: string;
}

export class Specifier {
  readonly project: string;
  readonly childProcessOptions: object;

  stylelint: LinterConfig = {
    modules: [
      'stylelint',
      'stylelint-config-standard',
      'stylelint-declaration-strict-value',
      'stylelint-no-unsupported-browser-features',
      'stylelint-scss',
      'stylelint-z-index-value-constraint'
    ],
    script: 'stylelint --syntax scss "./src/**/*.scss"',
    path: '../../specification/files/.stylelintrc'
  };

  eslint: LinterConfig = {
    modules: [
      'eslint',
      'eslint-config-airbnb',
      'eslint-plugin-compat',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y'
    ],
    script: 'eslint "./src/**/*.js"',
    path: '../../specification/files/.eslintrc'
  };

  constructor(project: string) {
    if (!project) {
      throw new Error('Target directory is required!');
    }

    this.project = project;
    this.childProcessOptions = { cwd: join(project), stdio: 'inherit' };
  }

  get name(): string {
    return this.project;
  }

  async copyEditorconfig(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await copy(
          join(__dirname, '../../specification/files/.editorconfig'),
          join(this.name, '.editorconfig')
        );

        resolve();
      } catch (err) {
        reject(new Error(red(`Editorconfig copying failed: ${err}`)));
      }
    }).then(() => console.log(green('Editorconfig successfully copied!')));
  }

  copyBrowserslistrc(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const json: PackageJson = readJsonSync(join(this.name, 'package.json'));

        delete json.browserslist;

        await Promise.all([
          writeJson(join(this.name, 'package.json'), json, {spaces: 2}),
          copy(
            join(__dirname, '../../specification/files/.browserslistrc'),
            join(this.name, '.browserslistrc')
          )
        ]);

        resolve();
      } catch (err) {
        reject(new Error(red(`browserslistrc copying failed: ${err}`)));
      }
    }).then(() => console.log(green('Browserslist successfully copied!')));
  }

  copyStylelintrc(): Promise<void> {
    return new Promise((resolve, reject) => {

      const npm: ChildProcess = spawn(
        'npm',
        ['i', ...this.stylelint.modules],
        this.childProcessOptions
      );

      npm.on('error', (err) => {
        reject(new Error(red(`Stylelint installation failed: ${err}`)));
      });

      npm.on('exit', async () => {
        try {
          const packageJson: PackageJson = readJsonSync( join(this.name, 'package.json') );

          packageJson.scripts['lint:scss'] = this.stylelint.script;

          await Promise.all([
            writeJson( join(this.name, 'package.json'), packageJson, { spaces: 2 } ),
            copy(
              join(__dirname, this.stylelint.path),
              join(this.name, '.stylelintrc')
            )
          ]);

          resolve();
        } catch (err) {
          reject(new Error(red(`Stylelint init was fell: ${err}`)));
        }
      });
    }).then(() => console.log(green('Stylelint successfully initiated!')));
  }

  copyEslintrc(): Promise<void> {
    return new Promise((resolve, reject) => {
      const npm: ChildProcess = spawn('npm', ['i', ...this.eslint.modules], this.childProcessOptions );

      npm.on('error', (err) => {
        reject(new Error(red(`Eslint init was fell: ${err}`)));
      });

      npm.on('exit', async () => {
        try {
          const packageJson: PackageJson = readJsonSync( join(this.name, 'package.json') );

          packageJson.scripts['lint:es'] = this.eslint.script;

          await Promise.all([
            writeJson( join(this.name, 'package.json'), packageJson, { spaces: 2 } ),
            copy(
              join(__dirname, this.eslint.path),
              join(this.name, '.eslintrc')
            )
          ]);
          resolve();
        } catch (err) {
          reject(new Error(red(`Eslint init was fell: ${err}`)));
        }
      });
    }).then(() => console.log(green('Eslint successfully initiated!')));
  }

  initGit() {
    return new Promise((resolve, reject) => {
      const git: ChildProcess = spawn(
        'git init',
        Object.assign({shell: true}, this.childProcessOptions)
      );

      git.on('exit', () => {
        resolve();
      });

      git.on('error', (err) => {
        reject(new Error(red(`Git init error: ${err}`)));
      });
    }).then(() => console.log(green('Git repository successfully initiated!')));
  }

  initialCommit() {
    return new Promise((resolve, reject) => {
      const git: ChildProcess = spawn(
        'git add .; git commit -m "Initial commit" -n',
        Object.assign({shell: true}, this.childProcessOptions)
      );

      git.on('exit', () => {
        resolve();
      });

      git.on('error', (err) => {
        reject(new Error(red(`Initial commit error: ${err}`)));
      });
    }).then(() => console.log(green('initial commit was successfully done!')));
  }

  addLintHooks() {
    return childProcessPromise(
      spawn('npm', ['i', 'husky'], this.childProcessOptions )
    ).then(
      () => {
        const packageJson: PackageJson & { husky: {} } = readJsonSync( join(this.name, 'package.json') );
        const lintScripts: string[] = Object.keys(packageJson.scripts)
          .filter((key: string): boolean => key.includes('lint'))
          .map((script: string): string => `npm run ${script}`);

        packageJson.scripts['lint:all'] = lintScripts.join(' && ');
        packageJson.husky = {
          hooks: {
            'pre-commit': 'npm run lint:all'
          }
        };

        return writeJson(
          join(this.name, 'package.json'),
          packageJson,
          { spaces: 2 }
        );
      },
      (err: Error) => {
        throw new Error(red(`lint hooks install was fell: ${err}`));
      }
    ).then(() => console.log(green('lint hooks successfully installed!')));
  }
}
