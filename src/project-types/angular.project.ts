import { AngularSpecifier } from '@specifier/angular.specifier';
import { command } from 'execa';
import { Listr } from 'listr2';
import { IAnswer } from '@src/main';

export const angularProject = (answers: IAnswer = { title: '', version: 'latest' } as IAnswer): Listr => {
  const { title, version, 'skip-git': skipGit } = answers;

  return new Listr([
    {
      title: 'Install Angular project',
      task: () =>
        command(
          `npx --package @angular/cli@${version} ng new ${title} --style=scss --routing=true --skip-install ${
            skipGit ? '--skip-git' : ''
          }`.trim()
        )
    },
    {
      title: 'Specify it...',
      task: () => new AngularSpecifier(answers).specify()
    }
  ]);
};
