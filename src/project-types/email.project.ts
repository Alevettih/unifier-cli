import { IContext } from '@src/main';
import { Listr } from 'listr2';
import { EmailSpecifier } from '@specifier/email.specifier';
import { join } from 'path';
import { command } from 'execa';

export const emailProject = (context: IContext): Listr => {
  const { title } = context;

  return new Listr([
    {
      title: 'Install Email project',
      task: () => command(`git clone https://github.com/Alevettih/email-builder-webpack.git ${join(title)}`)
    },
    {
      title: 'Specify it',
      task: () => new EmailSpecifier(context).specify()
    }
  ]);
};
