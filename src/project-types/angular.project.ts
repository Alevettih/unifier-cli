import { AngularSpecifier } from '@specifier/angular.specifier';
import { Answer } from '@src/main';
import { command } from 'execa';
import { red } from 'colors/safe';

export const angularProject = async ({ title } = { title: '' } as Answer): Promise<void> => {
  const process = command(`npx @angular/cli@7 new ${title} --style=scss --routing=true`, { stdio: 'inherit' });

  try {
    await process;
    await new AngularSpecifier(title).specify();
  } catch ({ message }) {
    throw new Error(red(`Angular CLI was fell ${message}`));
  }
};
