import { Answer } from '@src/main';
import { spawn } from 'child_process';
import { VueSpecifier } from '@specifier/vue.specifier';
import { join } from 'path';
import { childProcessPromise } from '@utils/helpers';

export const vueProject = ({ title } = { title: '' } as Answer): Promise<void> => {
  return childProcessPromise(
    spawn(
      'npx',
      [
        '@vue/cli',
        'create',
        `--preset=${join(__dirname, '../specification/files/vue/vue-preset-default.json')}`,
        title
      ],
      { stdio: 'inherit' }
    )
  ).then(
    async () => {
      await new VueSpecifier(title).specify();
    },
    e => {
      throw new Error(`@vue/cli was fell: ${e}`);
    }
  );
};
