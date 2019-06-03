import { copy, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { ChildProcess, spawn } from 'child_process';
import { PackageJson } from "tsconfig-paths/lib/filesystem";

export class Specifier {
  readonly project: string;
  readonly childProcessOptions: object;

  constructor(project: string) {
    if (!project) {
      throw new Error('Target directory is required!');
    }

    this.project = project;
    this.childProcessOptions = { cwd: join(project), stdio: 'inherit' }
  }

  get name(): string {
    return this.project
  }

  copyGitignore(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await copy(
          join(__dirname, '../../specification/files/.gitignore'),
          join(this.name, '.gitignore')
        );

        resolve();
      } catch (err) {
        reject(new Error(`Gitignore copying failed: ${err}`));
      }
    }).then(() => console.log('Gitignore successfully copied'));
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
        reject(new Error(`Editorconfig copying failed: ${err}`));
      }
    }).then(() => console.log('Editorconfig successfully copied!'));
  }

  async copyBrowserslistrc(): Promise<void> {
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
        reject(new Error(`browserslistrc copying failed: ${err}`));
      }
    }).then(() => console.log('Browserslist successfully copied!'));
  }

  copyStylelintrc(): Promise<void> {
    return new Promise((resolve, reject)=> {
      const modules: string[] = [
        'stylelint',
        'stylelint-config-standard',
        'stylelint-declaration-strict-value',
        'stylelint-no-unsupported-browser-features',
        'stylelint-scss',
        'stylelint-z-index-value-constraint'
      ];

      const npm: ChildProcess = spawn(
        'npm',
        ['i', ...modules],
        this.childProcessOptions
      );

      npm.on('error', (err) => {
        reject(new Error(`Stylelint installation failed: ${err}`));
      });

      npm.on('exit', async () => {
        try {
          const packageJson: PackageJson = readJsonSync( join(this.name, 'package.json') );

          packageJson.scripts['lint:scss'] = 'stylelint --syntax scss "./src/**/*.scss"';

          await Promise.all([
            writeJson( join(this.name, 'package.json'), packageJson, { spaces: 2 } ),
            copy(
              join(__dirname, '../../specification/files/.stylelintrc'),
              join(this.name, '.stylelintrc')
            )
          ]);

          resolve()
        } catch (err) {
          reject(new Error(`Stylelint init was fell: ${err}`));
        }
      })
    }).then(() => console.log('Stylelint successfully initiated!'))
  }

  initialCommit() {
    return new Promise((resolve, reject) => {
      const git: ChildProcess = spawn(
        'git init; git add .; git commit -m "Initial commit"',
        Object.assign({shell: true}, this.childProcessOptions)
      );

      git.on("exit", () => {
        resolve();
      });

      git.on("error", (err) => {
        reject(new Error(`Initial commit error: ${err}`));
      });
    }).then(() => console.log('Git repository successfully initiated!'))
  }
}
