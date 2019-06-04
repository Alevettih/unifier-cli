import { Answer } from '@src/main';
import { ChildProcess, spawn } from 'child_process';
import { VueSpecifier } from '@specifier/vue.specifier';
import { join } from 'path';

export const vueProject = ({ title } = { title: '' } as Answer): void => {
  const npx: ChildProcess = spawn(
    'npx',
    ['@vue/cli', 'create', `--preset=${join(__dirname, '../specification/files/vue/vue-preset-default.json')}`, title, '-n'],
    {stdio: 'inherit'}
  );

  npx.on('error', (e) => {
    throw new Error(`@vue/cli was fell: ${e}`);
  });

  npx.on('exit', async () => {
    await new VueSpecifier(title).specify();
  });
};
