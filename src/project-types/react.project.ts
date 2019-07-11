import { Answer } from '@src/main';
import { command } from 'execa';
import { ReactSpecifier } from '@specifier/react.specifier';
import { red } from 'colors/safe';

export const reactProject = async ({ title } = { title: '' } as Answer): Promise<void> => {
  const process = command(`npx create-react-app ${title}`, { stdio: 'inherit' });

  try {
    await process;
    await new ReactSpecifier(title).specify();
  } catch ({ message }) {
    throw new Error(red(`create-react-app CLI was fell: ${message}`));
  }
};
