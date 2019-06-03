import { spawn } from 'child_process';
import { AngularSpecifier } from "@specifier/angular.specifier";
import { Answer } from "@src/main";
import config from '@src/config';

export const angularProject = ({ title } = { title: '' } as Answer): void => {
  if (!title) {
    throw new Error('Title is required!')
  }

  const npx = spawn(
    'npx',
    ['@angular/cli@7', 'new', title, `--style=${config.cssPreprocessor}`, `--skipGit=${config.skipGit}`, '--routing=true'],
    {stdio: "inherit"}
  );

  npx.on('error', (e) => {
    throw new Error(`Angular CLI was fell ${e}`);
  });

  npx.on('exit', async () => {
    await new AngularSpecifier(title).specify();
  });
};
