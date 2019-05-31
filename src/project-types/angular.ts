import { exec } from 'child_process';
import { AngularSpecifier } from "@utils/specifier/angular";
import { Answer } from "@src/main";
import config from '@src/config';

export const angular = ({ title } = { title: '' } as Answer): void => {
  if (!title) {
    throw new Error('Title is required!')
  }

  const cliArgs = ['new', title, `--style=${config.cssPreprocessor}`, `--skipGit=${config.skipGit}`];

  exec(
    `npx @angular/cli@7 ${cliArgs.join(' ')}`,
    async (error) => {
      if (error) {
        throw new Error(`Angular CLI was fell ${error}`);
      }

      await new AngularSpecifier(title).specify();
    }
  ).stdout.pipe(process.stdout);
};
