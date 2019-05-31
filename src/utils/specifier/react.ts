import { Specifier } from "@specifier/index";
import { exec } from "child_process";
import { join } from "path";
import { readFile, writeFile, rename, readJsonSync, writeJsonSync, copySync } from "fs-extra";

export class ReactSpecifier extends Specifier {
  async specify(): Promise<void> {
    this.copyEditorconfig();
    this.copyBrowserslistrc();
    await Promise.all([
      this.addScss(),
      this.copyStylelintrc(),
      this.copyEslintrc()
    ]);
    await this.initialCommit();
  }

  copyEslintrc(): Promise<void> {
    return new Promise((resolve)=> {
      const modules = [
        'eslint',
        'eslint-config-airbnb',
        'eslint-plugin-compat',
        'eslint-plugin-import',
        'eslint-plugin-jsx-a11y',
        'eslint-plugin-react'
      ];

      exec(`npm i ${modules.join(' ')}`, {cwd: join(this.name)}, (error) => {
        if (error) {
          throw new Error(`Eslint init was fell ${error}`);
        }

        const packageJson = readJsonSync( join(this.name, 'package.json') );

        packageJson.scripts['lint:es'] = 'eslint "./src/**/*.js"';

        writeJsonSync( join(this.name, 'package.json'), packageJson, { spaces: 2 } );

        copySync(
          join(__dirname, '../../specification/files/react/.eslintrc'),
          join(this.name, '.eslintrc')
        );

        resolve();
      }).stdout.pipe(process.stdout);
    })
  }

  async addScss(): Promise<void> {
    try {
      await exec(
        `npm i node-sass`,
        { cwd: join(this.name) }
      ).stdout.pipe(process.stdout);

      const files = ['App', 'index'];

      const renames$ = files.map((key) => rename(
        join(this.name, `src/${key}.css`),
        join(this.name, `src/${key}.scss`)
      ));

      const contentChanges$ = files.map(async (name) => {
        const file = await readFile(join(this.name, `src/${name}.js`), 'utf-8');
        return await writeFile(
          join(this.name, `src/${name}.js`),
          file.replace(`${name}.css`, `${name}.scss`),
          'utf-8'
        );
      });

      await Promise.all([...renames$, ...contentChanges$]);
    } catch (error) {
      throw new Error(`SCSS installation was fell ${error}`);
    }
  }
}
