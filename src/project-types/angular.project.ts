import { AngularSpecifier } from '@specifier/angular.specifier';
import { command } from 'execa';
import { Listr } from 'listr2';
import { IContext } from '@src/main';

export const angularProject = (context: IContext): Listr => {
  const { title, version, skipGit } = context;

  return new Listr([
    {
      title: 'Install Angular project',
      task: () =>
        command(
          `npx --package @angular/cli@${version} ng new ${title} --style=scss --routing --skip-install --skip-git=${skipGit}`.trim()
        )
    },
    {
      title: 'Specify it',
      task: () => new AngularSpecifier(context).specify()
    }
  ]);
};
