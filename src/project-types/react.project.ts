import { Answer } from '@src/main';
import { spawn } from 'child_process';
import { ReactSpecifier } from '@specifier/react.specifier';
import { childProcessPromise } from '@utils/helpers';

export const reactProject = ({ title } = { title: '' } as Answer): Promise<void> => {
  return childProcessPromise(spawn('npx', ['create-react-app', title], { stdio: 'inherit' })).then(
    async () => {
      await new ReactSpecifier(title).specify();
    },
    e => {
      throw new Error(`create-react-app CLI was fell: ${e}`);
    }
  );
};
