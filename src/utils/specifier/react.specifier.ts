import { Specifier } from '@specifier/index';
import { join } from 'path';
import { readFile, writeFile, rename } from 'fs-extra';
import config from '@utils/specifier/configs/react.config';
import * as Listr from 'listr';
import { blue } from 'colors/safe';

export class ReactSpecifier extends Specifier {
  specify(): Listr {
    return new Listr([
      { title: 'Install dependencies', task: () => this.installPackages(config.modules) },
      {
        title: 'Do some magic...',
        task: () =>
          new Listr(
            [
              { title: 'Copy configs...', task: () => this.copyConfigs(...config.getConfigsPaths(this.name)) },
              { title: `Add ${blue('config.js')} file`, task: () => this.addConfigJs() },
              {
                title: `Add link to ${blue('config.js')} in ${blue('index.html')}`,
                task: () => this.addLinkToConfigJsInHtml()
              },
              { title: `Update ${blue('.gitignore')} rules`, task: () => this.updateGitignoreRules() },
              { title: `Switch ${blue('*.css')} with ${blue('*.scss')}`, task: () => this.cssToScss() },
              {
                title: `Update ${blue('package.json')}`,
                task: () => this.mergeWithJson(join(this.name, 'package.json'), config.packageJson)
              }
            ],
            { concurrent: true }
          )
      },
      {
        title: 'Do initial commit',
        task: () => this.initialCommit(true)
      }
    ]);
  }

  cssToScss(): Promise<void> {
    const files: string[] = ['App', 'index'];

    const renames$: Promise<void>[] = files.map(key =>
      rename(join(this.name, `src/${key}.css`), join(this.name, `src/${key}.scss`))
    );

    const contentChanges$: Promise<void>[] = files.map(async (name: string) => {
      const file = await readFile(join(this.name, `src/${name}.js`), 'utf-8');
      return writeFile(join(this.name, `src/${name}.js`), file.replace(`${name}.css`, `${name}.scss`), 'utf-8');
    });

    return Promise.all([...renames$, ...contentChanges$]).then(
      () => {
        // console.log(green('.css successfully replaced by .scss'));
      },
      err => {
        throw new Error(`.css replacing failed: ${err}`);
      }
    );
  }
}
