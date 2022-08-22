import { IPaths, Specifier } from '@utils/specifier';
import { join } from 'path';
import { ProjectType } from '@src/project-types';
import { AngularSpecifier } from '@specifier/angular.specifier';

export function getConfigsPaths(type: ProjectType, name: string): IPaths[] {
  switch (type) {
    case ProjectType.ANGULAR:
      return [
        {
          src: join(__dirname, Specifier.CONFIGS_DIR, '.prettierrc'),
          dist: join(name, '.prettierrc')
        },
        {
          src: join(__dirname, Specifier.CONFIGS_DIR, '.prettierignore'),
          dist: join(name, '.prettierignore')
        },
        {
          src: join(__dirname, AngularSpecifier.CONFIGS_DIR, '.htaccess'),
          dist: join(name, 'src/.htaccess')
        },
        {
          src: join(__dirname, AngularSpecifier.CONFIGS_DIR, 'default.conf'),
          dist: join(name, 'src/default.conf')
        },
        {
          src: join(__dirname, AngularSpecifier.CONFIGS_DIR, '.eslintrc.json'),
          dist: join(name, '.eslintrc.json')
        },
        {
          src: join(__dirname, AngularSpecifier.CONFIGS_DIR, 'tsconfig.json'),
          dist: join(name, 'tsconfig.json')
        },
        {
          src: join(__dirname, Specifier.CONFIGS_DIR, '.browserslistrc'),
          dist: join(name, '.browserslistrc')
        },
        {
          src: join(__dirname, Specifier.CONFIGS_DIR, '.editorconfig'),
          dist: join(name, '.editorconfig')
        },
        {
          src: join(__dirname, AngularSpecifier.CONFIGS_DIR, '.stylelintrc'),
          dist: join(name, '.stylelintrc')
        }
      ];
    case ProjectType.PLAIN:
      return [
        {
          src: join(__dirname, Specifier.CONFIGS_DIR, '.prettierrc'),
          dist: join(name, '.prettierrc')
        },
        {
          src: join(__dirname, Specifier.CONFIGS_DIR, '.prettierignore'),
          dist: join(name, '.prettierignore')
        },
        {
          src: join(__dirname, Specifier.CONFIGS_DIR, '.editorconfig'),
          dist: join(name, '.editorconfig')
        },
        {
          src: join(__dirname, Specifier.CONFIGS_DIR, '.browserslistrc'),
          dist: join(name, '.browserslistrc')
        },
        {
          src: join(__dirname, Specifier.CONFIGS_DIR, '.stylelintrc'),
          dist: join(name, '.stylelintrc')
        },
        {
          src: join(__dirname, Specifier.CONFIGS_DIR, '.eslintrc'),
          dist: join(name, '.eslintrc')
        }
      ];
  }
}
