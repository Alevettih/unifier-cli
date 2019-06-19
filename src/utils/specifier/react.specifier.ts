import { Specifier } from '@specifier/index';
import { join } from 'path';
import { readFile, writeFile, rename } from 'fs-extra';
import { green } from 'colors/safe';
import config from '@utils/specifier/configs/react.config';

export class ReactSpecifier extends Specifier {
  async specify(): Promise<void> {
    await this.npmInstall(config.modules);
    await Promise.all([
      this.copyConfigs(...config.getConfigsPaths(this.name)),
      this.addConfigJs(),
      this.updateGitignoreRules(),
      this.cssToScss(),
      this.addLinkToConfigJsInHtml(),
      this.mergeWithJson(
        join(this.name, 'package.json'),
        config.packageJson
      )
    ]);
    await this.initialCommit('--amend');
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
}
