import { configsDir, IConfigPaths } from '@utils/specifier';
import { join } from 'path';

export default {
  getConfigsPaths(name: string): IConfigPaths[] {
    return [
      {
        src: join(__dirname, configsDir, '.prettierrc'),
        dist: join(name, '.prettierrc')
      },
      {
        src: join(__dirname, configsDir, '.prettierignore'),
        dist: join(name, '.prettierignore')
      },
      {
        src: join(__dirname, configsDir, '.editorconfig'),
        dist: join(name, '.editorconfig')
      },
      {
        src: join(__dirname, configsDir, '.browserslistrc'),
        dist: join(name, '.browserslistrc')
      },
      {
        src: join(__dirname, configsDir, '.stylelintrc'),
        dist: join(name, '.stylelintrc')
      },
      {
        src: join(__dirname, configsDir, '.eslintrc'),
        dist: join(name, '.eslintrc')
      }
    ];
  }
};
