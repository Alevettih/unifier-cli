import { Answer } from '@src/main';
import { join } from 'path';
import { EmailSpecifier } from '@specifier/email.specifier';
import { command } from 'execa';
import { red } from 'colors/safe';

export const emailProject = async ({ title } = { title: '' } as Answer): Promise<void> => {
  const process = command(
    `git clone git@gitlab.requestum.com:front-end-tools/email-template-compiler.git ${join(title)}`,
    { stdio: 'inherit' }
  );

  try {
    await process;
    await new EmailSpecifier(title).specify();
  } catch ({ message }) {
    throw new Error(red(`Cloning of Plain JS project was fell ${message}`));
  }
};
