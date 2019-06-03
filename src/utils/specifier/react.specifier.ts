import { Specifier } from "@specifier/index";
import { ChildProcess, spawn } from "child_process";
import { join } from "path";
import { readFile, writeFile, rename, copy, readJson, writeJson } from "fs-extra";
import { PackageJson } from "tsconfig-paths/lib/filesystem";

export class ReactSpecifier extends Specifier {
  async specify(): Promise<void> {
    await Promise.all([
      this.copyEditorconfig(),
      this.copyBrowserslistrc(),
      this.addScss(),
      this.copyStylelintrc(),
      this.copyEslintrc()
    ]);
    await this.initialCommit();
  }

  copyEslintrc(): Promise<void> {
    return new Promise((resolve, reject)=> {
      const modules: string[] = [
        'eslint',
        'eslint-config-airbnb',
        'eslint-plugin-compat',
        'eslint-plugin-import',
        'eslint-plugin-jsx-a11y',
        'eslint-plugin-react'
      ];

      const npm: ChildProcess = spawn('npm', ['i', ...modules], this.childProcessOptions );

      npm.on('error', (err) => {
        reject(new Error(`Eslint init was fell: ${err}`));
      });

      npm.on('exit', async () => {
        try {
          const packageJson: PackageJson = await readJson( join(this.name, 'package.json') );

          packageJson.scripts['lint:es'] = 'eslint "./src/**/*.js"';

          await Promise.all([
            writeJson( join(this.name, 'package.json'), packageJson, { spaces: 2 } ),
            copy(
              join(__dirname, '../../specification/files/react/.eslintrc'),
              join(this.name, '.eslintrc')
            )
          ]);
          resolve();
        } catch (err) {
          reject(new Error(`Eslint init was fell: ${err}`));
        }
      });
    }).then(() => console.log('Eslint successfully initiated!'));
  }

  addScss(): Promise<void> {
    return new Promise((resolve, reject) => {
      const npm: ChildProcess = spawn('npm', ['i', 'node-sass'], this.childProcessOptions);

      npm.on('error', (err) => {
        reject(new Error(`SCSS installation was fell: ${err}`));
      });

      npm.on('exit', async () => {
        const files: string[] = ['App', 'index'];

        const renames$: Promise<void>[] = files.map((key) => rename(
          join(this.name, `src/${key}.css`),
          join(this.name, `src/${key}.scss`)
        ));

        const contentChanges$: Promise<void>[] = files.map(async (name: string) => {
          const file = await readFile(join(this.name, `src/${name}.js`), 'utf-8');
          return writeFile(
            join(this.name, `src/${name}.js`),
            file.replace(`${name}.css`, `${name}.scss`),
            'utf-8'
          );
        });

        await Promise.all([...renames$, ...contentChanges$]);

        resolve();
      });
    }).then(() => console.log('SCSS successfully installed!'))
  }
}
