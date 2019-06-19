import { join } from 'path';
import { ConfigPaths } from '@utils/specifier';

export default {
  modules: [
    'husky',

    'stylelint',
    'stylelint-config-standard',
    'stylelint-declaration-strict-value',
    'stylelint-no-unsupported-browser-features',
    'stylelint-scss',
    'stylelint-z-index-value-constraint'
  ],
  packageJson: {
    scripts: {
      'build:prod': 'ng build --prod',
      'lint:scss': 'stylelint "./src/**/*.scss"',
      'lint:all': 'npm run lint && npm run lint:scss'
    },
    husky: {
      hooks: {
        'pre-commit': 'npm run lint:all'
      }
    }
  },
  getConfigsPaths(name: string): ConfigPaths[] {
    return [
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
        src: join(__dirname, '../../../specification/files/.stylelintrc'),
        dist: join(name, '.stylelintrc')
      }
    ];
  }
};
