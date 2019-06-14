import { spawn } from 'child_process';
import { AngularSpecifier } from '@specifier/angular.specifier';
import { Answer } from '@src/main';
import { childProcessPromise } from '@utils/helpers';

export const angularProject = ({ title } = { title: '' } as Answer): Promise<void> => {
  return childProcessPromise(
    spawn(
      'npx',
      ['@angular/cli@7', 'new', title, `--style=scss`, `--skipGit=true`, '--routing=true'],
      {stdio: 'inherit'}
    )
  ).then(
    async () => {
      await new AngularSpecifier(title).specify();
    },
    (e) => {
      throw new Error(`Angular CLI was fell ${e}`);
    }
  );
};
