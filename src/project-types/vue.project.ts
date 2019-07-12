import { Answer } from '@src/main';
import { join } from 'path';
import { command } from 'execa';
import { VueSpecifier } from '@specifier/vue.specifier';
import * as Listr from 'listr';

export const vueProject = ({ title }: Answer = { title: '' } as Answer): Listr => {
  return new Listr([
    {
      title: 'Install Vue project',
      task: () =>
        command(
          `npx @vue/cli create --preset=${join(
            __dirname,
            '../specification/files/vue/vue-preset-default.json'
          )} ${title}`
        )
    },
    {
      title: 'Specify it...',
      task: () => new VueSpecifier(title).specify()
    }
  ]);
};
