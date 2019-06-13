import { LinterConfig, Specifier } from '@specifier/index';
import { join } from 'path';
import { readFile, writeFile, rename, readJsonSync, writeJson } from 'fs-extra';
import { green, red } from 'colors/safe';
import { PackageJson } from 'tsconfig-paths/lib/filesystem';

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
    await this.removeDefaultGit();
    await this.initGit();
    await this.npmInstall(['node-sass', 'husky', ...this.eslint.modules, ...this.stylelint.modules]);
    await Promise.all([
      this.copyEditorconfig(),
      this.copyBrowserslistrc(),
      this.copyStylelintrc(),
      this.copyEslintrc(),
      this.addConfigJs(),
      this.cssToScss(),
      this.addLinkToConfigJsInHtml()
    ]);
    await this.removeBrowserslistrcFromPackageJson();
    await this.addStylelintTaskToPackageJson();
    await this.addEslintTaskToPackageJson();
    await this.addLintHooks();
    await this.initialCommit();
  }

  cssToScss(): Promise<void> {
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

    return Promise.all(
      [...renames$, ...contentChanges$]
    ).then(
      () => { console.log(green('.css successfully replaced by .scss')); },
      (err) => { throw new Error(`.css replacing failed: ${err}`); }
    );
  }

  removeBrowserslistrcFromPackageJson(): Promise<void> {
    const json: PackageJson = readJsonSync(join(this.name, 'package.json'));
    delete json.browserslist;
    return writeJson(
      join(this.name, 'package.json'),
      json,
      {spaces: 2}
    ).then(
      () => { console.log(green('Browserslist successfully removed from package.json!')); },
      (err) => { throw new Error(red(`Browserslist removing from package.json failed: ${err}`)); }
    );
  }
}
