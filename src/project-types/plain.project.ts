import { Answer } from '@src/main';
import * as Listr from 'listr';
import { PlainJSSpecifier } from '@specifier/plain-js.specifier';
import { join } from 'path';
import { command } from 'execa';

export const plainProject = ({ title }: Answer = { title: '' } as Answer): Listr => {
  return new Listr([
    {
      title: 'Install Plain JS project',
      task: () => command(`git clone https://github.com/Alevettih/unifier-cli.git ${join(title)}`)
    },
    {
      title: 'Specify it...',
      task: () => new PlainJSSpecifier(title).specify()
    }
  ]);
};
