import { Answer } from '@src/main';
import { join } from 'path';
import { EmailSpecifier } from '@specifier/email.specifier';
import { command } from 'execa';
import { Listr } from 'listr2';

export const emailProject = ({ title }: Answer = { title: '' } as Answer): Listr => {
  return new Listr([
    {
      title: 'Install Email project',
      task: () => command(`git clone https://github.com/oksanamuz/email-templates-compiler.git ${join(title)}`)
    },
    {
      title: 'Specify it...',
      task: () => new EmailSpecifier(title).specify()
    }
  ]);
};
