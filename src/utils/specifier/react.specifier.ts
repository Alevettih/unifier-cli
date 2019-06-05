import { LinterConfig, Specifier } from '@specifier/index';
import { ChildProcess, spawn } from 'child_process';
import { join } from 'path';
import { readFile, writeFile, rename } from 'fs-extra';
import { green, red } from 'colors/safe';

export class ReactSpecifier extends Specifier {

  eslint: LinterConfig = {
    modules: [
      'eslint',
      'eslint-config-airbnb',
      'eslint-plugin-compat',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'eslint-plugin-jest',
    ],
    script: 'eslint "./src/**/*.js"',
    path: '../../specification/files/react/.eslintrc'
  };
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

  addScss(): Promise<void> {
    return new Promise((resolve, reject) => {
      const npm: ChildProcess = spawn('npm', ['i', 'node-sass'], this.childProcessOptions);

      npm.on('error', (err) => {
        reject(new Error(red(`SCSS installation was fell: ${err}`)));
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
    }).then(() => console.log(green('SCSS successfully installed!')));
  }
}
