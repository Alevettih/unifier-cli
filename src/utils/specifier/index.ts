import { copySync, readJsonSync, writeJsonSync } from 'fs-extra';
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

  copyGitignore(): void {
    copySync(
      join(__dirname, '../../specification/files/.gitignore'),
      join(this.name, '.gitignore')
    );
  }

  copyEditorconfig(): void {
    copySync(
      join(__dirname, '../../specification/files/.editorconfig'),
      join(this.name, '.editorconfig')
    );
  }

  copyBrowserslistrc(): void {
    copySync(
      join(__dirname, '../../specification/files/.browserslistrc'),
      join(this.name, '.browserslistrc')
    );

    const json = readJsonSync(join(this.name, 'package.json'));

    delete json.browserslist;

    writeJsonSync(join(this.name, 'package.json'), json, {spaces: 2})
  }

  copyStylelintrc(): Promise<void> {
    return new Promise((resolve)=> {
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
          throw new Error(`Stylelint init was fell ${error}`);
        }

        const packageJson = readJsonSync( join(this.name, 'package.json') );

        packageJson.scripts['lint:scss'] = 'stylelint --syntax scss "./src/**/*.scss"';

        writeJsonSync( join(this.name, 'package.json'), packageJson, { spaces: 2 } );

        copySync(
          join(__dirname, '../../specification/files/.stylelintrc'),
          join(this.name, '.stylelintrc')
        );

        resolve();
      }).stdout.pipe(process.stdout);
    })
  }

  initialCommit() {
    exec(
      `git init; git add .; git commit -m "Initial commit"`,
      {cwd: join(this.name)},
      (error, stdout) => {
        if (error) {
          throw new Error(`Initial commit error: ${error}`);
        }

        if (stdout) {
          console.log('Git repository successfully initiated!')
        }
      }
    );
  }
}
