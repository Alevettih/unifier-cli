import { Answer } from '@src/main';
import { PlainJSSpecifier } from '@specifier/plain-js.specifier';
import { spawn } from 'child_process';
import { join } from 'path';
import { childProcessPromise } from '@utils/helpers';

export const plainProject = ({ title } = { title: '' } as Answer): Promise<void> => {
  return childProcessPromise(
    spawn('git', ['clone', 'git@gitlab.requestum.com:Tykhonenko/project-template-gulp.git', join(title)], {
      stdio: 'inherit'
    })
  ).then(
    async () => {
      await new PlainJSSpecifier(title).specify();
    },
    e => {
      throw new Error(`Cloning of Plain JS project was fell ${e}`);
    }
  );
};
