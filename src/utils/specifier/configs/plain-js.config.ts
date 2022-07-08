import { ConfigPaths } from '@utils/specifier';
import { join } from 'path';

export default {
  getConfigsPaths(name: string): ConfigPaths[] {
    return [
      {
        src: join(__dirname, '../files/.prettierrc'),
        dist: join(name, '.prettierrc')
      },
      {
        src: join(__dirname, '../files/.prettierignore'),
        dist: join(name, '.prettierignore')
      },
      {
        src: join(__dirname, '../files/.editorconfig'),
        dist: join(name, '.editorconfig')
      },
      {
        src: join(__dirname, '../files/.browserslistrc'),
        dist: join(name, '.browserslistrc')
      },
      {
        src: join(__dirname, '../files/.stylelintrc'),
        dist: join(name, '.stylelintrc')
      },
      {
        src: join(__dirname, '../files/.eslintrc'),
        dist: join(name, '.eslintrc')
      }
    ];
  }
};
