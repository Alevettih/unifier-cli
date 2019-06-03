import { copy, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { exec } from 'child_process';

export class Specifier {
  readonly project: string;

  constructor(project: string) {
    if (!project) {
      throw new Error('Target directory is required!');
    }

    this.project = project;
  }

  get name(): string {
    return this.project
  }

  async copyGitignore(): Promise<void> {
    await copy(
      join(__dirname, '../../specification/files/.gitignore'),
      join(this.name, '.gitignore')
    ).then(() => {
      console.log('Gitignore successfully copied')
    }, (err) => {
      throw new Error(err);
    });
  }

  async copyEditorconfig(): Promise<void> {
    await copy(
      join(__dirname, '../../specification/files/.editorconfig'),
      join(this.name, '.editorconfig')
    ).then(() => {
      console.log('Editorconfig successfully copied!')
    }, (err) => {
      throw new Error(err);
    });
  }

  async copyBrowserslistrc(): Promise<void> {
    const json = readJsonSync(join(this.name, 'package.json'));

    delete json.browserslist;

    await Promise.all([
      writeJson(join(this.name, 'package.json'), json, {spaces: 2}),
      copy(
        join(__dirname, '../../specification/files/.browserslistrc'),
        join(this.name, '.browserslistrc')
      )
    ]).then(() => {
      console.log('Browserslist successfully copied!');
    }, (err) => {
      throw new Error(err);
    })
  }

  copyStylelintrc(): Promise<void> {
    return new Promise((resolve, reject)=> {
      const modules = [
        'stylelint',
        'stylelint-config-standard',
        'stylelint-declaration-strict-value',
        'stylelint-no-unsupported-browser-features',
        'stylelint-scss',
        'stylelint-z-index-value-constraint'
      ];

      exec(`npm i ${modules.join(' ')}`, {cwd: join(this.name)}, (error) => {
        if (error) {
          reject(new Error(`Stylelint init was fell: ${error}`));
        }

        const packageJson = readJsonSync( join(this.name, 'package.json') );

        packageJson.scripts['lint:scss'] = 'stylelint --syntax scss "./src/**/*.scss"';

        Promise.all([
          writeJson( join(this.name, 'package.json'), packageJson, { spaces: 2 } ),
          copy(
            join(__dirname, '../../specification/files/.stylelintrc'),
            join(this.name, '.stylelintrc')
          )
        ]).then(() => {
          console.log('Stylelint successfully initiated!');
          resolve()
        }, (err) => {
          reject(new Error(`Stylelint init was fell: ${err}`));
        });
      }).stdout.pipe(process.stdout);
    })
  }

  initialCommit() {
    return new Promise(((resolve, reject) => {
      exec(
        `git init; git add .; git commit -m "Initial commit"`,
        {cwd: join(this.name)},
        (error, stdout) => {
          if (error) {
            reject(new Error(`Initial commit error: ${error}`));
          }

          if (stdout) {
            console.log('Git repository successfully initiated!');
            resolve();
          }
        }
      );
    }))
  }
}
