import { Answer } from '@src/main';
import { Listr } from 'listr2';
import { PlainJSSpecifier } from '@specifier/plain-js.specifier';
import { join } from 'path';
import { command } from 'execa';

export const plainProject = (answers: Answer = { title: '' } as Answer): Listr => {
  const { title } = answers;

  return new Listr([
    {
      title: 'Install Plain JS project',
      task: () => command(`git clone https://github.com/Alevettih/project-template-webpack.git ${join(title)}`)
    },
    {
      title: 'Specify it...',
      task: () => new PlainJSSpecifier(answers).specify()
    }
  ]);
};
