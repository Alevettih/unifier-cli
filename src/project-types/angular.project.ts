import { AngularSpecifier } from '@specifier/angular.specifier';
import { command } from 'execa';
import * as Listr from 'listr';
import { Answer } from '@src/main';

export const angularProject = ({ title }: Answer = { title: '' } as Answer): Listr => {
  return new Listr([
    {
      title: 'Install Angular project',
      task: () => command(`npx @angular/cli@7 new ${title} --style=scss --routing=true`)
    },
    {
      title: 'Specify it...',
      task: () => new AngularSpecifier(title).specify()
    }
  ]);
};
