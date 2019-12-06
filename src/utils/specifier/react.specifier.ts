import { Specifier } from '@specifier/index';
import { join } from 'path';
import { readFileSync, writeFile, rename } from 'fs-extra';
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
              { title: `Update ${blue('.gitignore')} rules`, task: () => this.updateGitignoreRules() },
              { title: `Add ${blue('config.js')} file`, task: () => this.addConfigJs() },
              {
                title: `Add link to ${blue('config.js')} in ${blue('index.html')}`,
                task: () => this.addLinkToConfigJsInHtml()
              },
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
        title: 'Run Prettier',
        task: () => this.runPrettier()
      },
      {
        title: 'Linters',
        task: () => this.lintersTask()
      },
      {
        title: 'Do initial commit',
        task: () => this.initialCommit(true)
      }
    ]);
  }

  cssToScss(): Listr {
    const files: string[] = ['App', 'index'];

    return new Listr(
      [
        {
          title: 'Edit mentions',
          task: () => this.editCSSMentions(files)
        },
        {
          title: 'Change extensions',
          task: () => this.changeCSSExtension(files)
        }
      ],
      { concurrent: true }
    );
  }

  private editCSSMentions(files: string[]): Listr {
    return new Listr(
      files.map((name: string) => ({
        title: `In ${blue(`${name}.js`)}`,
        task: () => {
          const file = readFileSync(join(this.name, `src/${name}.js`), 'utf-8');

          return writeFile(join(this.name, `src/${name}.js`), file.replace(`${name}.css`, `${name}.scss`), 'utf-8');
        }
      }))
    );
  }

  private changeCSSExtension(files: string[]): Listr {
    return new Listr(
      files.map(key => ({
        title: `Rename ${blue(`${key}.css`)} to ${blue(`${key}.scss`)}`,
        task: () => rename(join(this.name, `src/${key}.css`), join(this.name, `src/${key}.scss`))
      }))
    );
  }
}
