import { AngularSpecifier } from '@specifier/angular.specifier';
import { command } from 'execa';
import { Listr } from 'listr2';
import { Answer } from '@src/main';

export const angularProject = ({ title, version }: Answer = { title: '', version: 'latest' } as Answer): Listr => {
  return new Listr([
    {
      title: 'Install Angular project',
      task: () =>
        command(`npx --package @angular/cli@${version} ng new ${title} --style=scss --routing=true --skip-install`)
    },
    {
      title: 'Specify it...',
      task: () => new AngularSpecifier(title, version).specify()
    }
  ]);
};
