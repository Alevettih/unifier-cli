import { Specifier } from '@specifier/index';
import * as Listr from 'listr';
import { blue } from 'colors/safe';

export class EmailSpecifier extends Specifier {
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
              { title: `Update ${blue('.gitignore')} rules`, task: () => this.updateGitignoreRules() },
              { title: 'Install dependencies', task: () => this.installPackages() }
            ],
            { concurrent: true }
          )
      },
      {
        title: 'Do initial commit',
        task: () => this.initialCommit()
      }
    ]);
  }
}
