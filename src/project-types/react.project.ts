import { Answer } from '@src/main';
import { command } from 'execa';
import { ReactSpecifier } from '@specifier/react.specifier';
import * as Listr from 'listr';

export const reactProject = ({ title }: Answer = { title: '' } as Answer): Listr => {
  return new Listr([
    {
      title: 'Install React Project',
      task: () => command(`npx create-react-app ${title}`)
    },
    {
      title: 'Specify it...',
      task: () => new ReactSpecifier(title).specify()
    }
  ]);
};
