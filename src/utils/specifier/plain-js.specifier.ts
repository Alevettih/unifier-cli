import config from '@specifier/configs/plain-js.config';
import { Specifier } from '@specifier/index';
import { Listr } from 'listr2';
import { cyan } from 'ansi-colors';
import { removeSync } from 'fs-extra';
import { join } from 'path';

export class PlainJSSpecifier extends Specifier {
  specify(): Listr {
    return new Listr([
      {
        title: 'Git',
        task: () =>
          new Listr([
            { title: 'Remove default', task: () => removeSync(join(this.name, '.git')) },
            { title: 'Init new repository', task: () => this.initGit() }
          ])
      },
      {
        title: 'Do some magic...',
        task: () =>
          new Listr(
            [
              { title: 'Copy configs...', task: () => this.copyConfigs(...config.getConfigsPaths(this.name)) },
              { title: `Update ${cyan('.gitignore')} rules`, task: () => this.updateGitignoreRules() },
              { title: 'Install dependencies', task: () => this.installPackages() }
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
        task: () => this.initialCommit()
      }
    ]);
  }
}
