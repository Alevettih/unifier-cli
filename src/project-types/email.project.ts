import { Answer } from '@src/main';
import { spawn } from 'child_process';
import { join } from 'path';
import { childProcessPromise } from '@utils/helpers';
import { EmailSpecifier } from '@specifier/email.specifier';

export const emailProject = ({ title } = { title: '' } as Answer): Promise<void> => {
  return childProcessPromise(
    spawn('git', ['clone', 'git@gitlab.requestum.com:front-end-tools/email-template-compiler.git', join(title)], {
      stdio: 'inherit'
    })
  ).then(
    async () => {
      await new EmailSpecifier(title).specify();
    },
    e => {
      throw new Error(`Cloning of Plain JS project was fell ${e}`);
    }
  );
};
