import { AngularSpecifier } from '@specifier/angular.specifier';
import { command } from 'execa';
import * as Listr from 'listr';
import { Answer } from '@src/main';

export const angularProject = ({ title }: Answer = { title: '' } as Answer): Listr => {
  return new Listr([
    {
      title: 'Install Angular project',
      task: () =>
        command(`npx --package @angular/cli@13 ng new ${title} --style=scss --routing=true --skip-install --verbose`)
    },
    {
      title: 'Specify it...',
      task: () => new AngularSpecifier(title).specify()
    }
  ]);
};
