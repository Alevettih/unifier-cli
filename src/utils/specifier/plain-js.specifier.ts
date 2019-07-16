import { Specifier } from '@specifier/index';
import * as Listr from 'listr';
import config from '@specifier/configs/plain-js.config';
import { blue } from 'colors/safe';

export class PlainJSSpecifier extends Specifier {
  specify(): Listr {
    return new Listr([
      {
        title: 'Git',
        task: () =>
          new Listr([
            { title: 'Remove default', task: () => this.removeDefaultGit() },
            { title: 'Init new repository', task: () => this.initGit() }
          ])
      },
      {
        title: 'Do some magic...',
        task: () =>
          new Listr(
            [
              { title: 'Copy configs...', task: () => this.copyConfigs(...config.getConfigsPaths(this.name)) },
              { title: `Update ${blue('.gitignore')} rules`, task: () => this.updateGitignoreRules() },
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
