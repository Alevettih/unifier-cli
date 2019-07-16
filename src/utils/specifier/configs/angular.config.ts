import { join } from 'path';
import { ConfigPaths } from '@utils/specifier';

export default {
  modules: [
    'husky',

    'prettier',
    'pretty-quick',
    'onchange',

    'stylelint',
    'stylelint-config-standard',
    'stylelint-declaration-strict-value',
    'stylelint-no-unsupported-browser-features',
    'stylelint-scss',
    'stylelint-z-index-value-constraint'
  ],
  packageJson: {
    scripts: {
      lint: 'ng lint --fix',
      'build:prod': 'ng build --prod',
      'lint:scss': 'stylelint "./src/**/*.scss" --fix',
      'lint:scss:watch': 'onchange "src/**/*.scss" -- stylelint {{changed}}',
      'lint:all': 'npm run lint && npm run lint:scss'
    },
    husky: {
      hooks: {
        'pre-commit': 'pretty-quick --staged; npm run lint:all'
      }
    }
  },
  getConfigsPaths(name: string): ConfigPaths[] {
    return [
      {
        src: join(__dirname, '../../../specification/files/.prettierrc'),
        dist: join(name, '.prettierrc')
      },
      {
        src: join(__dirname, '../../../specification/files/.prettierignore'),
        dist: join(name, '.prettierignore')
      },
      {
        src: join(__dirname, '../../../specification/files/angular/.htaccess'),
        dist: join(name, 'src/.htaccess')
      },
      {
        src: join(__dirname, '../../../specification/files/angular/tsconfig.json'),
        dist: join(name, 'tsconfig.json')
      },
      {
        src: join(__dirname, '../../../specification/files/.browserslistrc'),
        dist: join(name, '.browserslistrc')
      },
      {
        src: join(__dirname, '../../../specification/files/.editorconfig'),
        dist: join(name, '.editorconfig')
      },
      {
        src: join(__dirname, '../../../specification/files/angular/.stylelintrc'),
        dist: join(name, '.stylelintrc')
      }
    ];
  }
};
