import { Answer } from '@src/main';
import { PlainJSSpecifier } from '@specifier/plain-js.specifier';
import { join } from 'path';
import { command } from 'execa';
import { red } from 'colors/safe';

export const plainProject = async ({ title } = { title: '' } as Answer): Promise<void> => {
  const process = command(
    `git clone git@gitlab.requestum.com:front-end-tools/project-template-gulp.git ${join(title)}`,
    { stdio: 'inherit' }
  );

  try {
    await process;
    await new PlainJSSpecifier(title).specify();
  } catch ({ message }) {
    throw new Error(red(`Cloning of Plain JS project was fell: ${message}`));
  }
};
