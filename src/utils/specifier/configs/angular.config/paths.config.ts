import { configsDir, IConfigPaths } from '@utils/specifier';
import { join } from 'path';

export function getConfigsPaths(name: string): IConfigPaths[] {
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
      src: join(__dirname, configsDir, 'angular/.htaccess'),
      dist: join(name, 'src/.htaccess')
    },
    {
      src: join(__dirname, configsDir, 'angular/default.conf'),
      dist: join(name, 'src/default.conf')
    },
    {
      src: join(__dirname, configsDir, 'angular/.eslintrc.json'),
      dist: join(name, '.eslintrc.json')
    },
    {
      src: join(__dirname, configsDir, 'angular/tsconfig.json'),
      dist: join(name, 'tsconfig.json')
    },
    {
      src: join(__dirname, configsDir, '.browserslistrc'),
      dist: join(name, '.browserslistrc')
    },
    {
      src: join(__dirname, configsDir, '.editorconfig'),
      dist: join(name, '.editorconfig')
    },
    {
      src: join(__dirname, configsDir, 'angular/.stylelintrc'),
      dist: join(name, '.stylelintrc')
    }
  ];
}
