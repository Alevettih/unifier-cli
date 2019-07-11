import { Answer } from '@src/main';
import { join } from 'path';
import { command } from 'execa';
import { VueSpecifier } from '@specifier/vue.specifier';
import { red } from 'colors/safe';

export const vueProject = async ({ title } = { title: '' } as Answer): Promise<void> => {
  const process = command(
    `npx @vue/cli create --preset=${join(__dirname, '../specification/files/vue/vue-preset-default.json')} ${title}`,
    { stdio: 'inherit' }
  );

  try {
    await process;
    await new VueSpecifier(title).specify();
  } catch ({ message }) {
    throw new Error(red(`@vue/cli was fell: ${message}`));
  }
};
