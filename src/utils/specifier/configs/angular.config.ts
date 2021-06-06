import { join } from 'path';
import { ConfigPaths } from '@utils/specifier';

export default {
  modules: [
    '@ngx-translate/core',
    '@ngx-translate/http-loader',
    'ngx-pagination',

    'eslint-plugin-prettier',
    'eslint-config-prettier',

    'class-transformer',

    'husky',

    'npm-run-all',

    'prettier',
    'pretty-quick',

    'reset-css',

    'stylelint',
    'stylelint-config-standard',
    'stylelint-declaration-strict-value',
    'stylelint-no-unsupported-browser-features',
    'stylelint-scss',

    'tslint-config-prettier'
  ],
  packageJson: {
    scripts: {
      'start:ssl': 'ng serve --ssl',
      'config:to-base64': 'node ./bin/to-base64.js',
      'config:from-base64': 'node ./bin/from-base64.js',
      lint: 'ng lint --fix',
      build: 'ng build --prod',
      'lint:scss': 'stylelint "./src/**/*.scss" --fix',
      'lint:all': 'npm run lint && npm run lint:scss',
      prettier: 'prettier --write "src/**/*.*(ts|js|json|html)"',
      'pretty-quick': 'pretty-quick --staged --pattern "src/**/*.*(ts|js|json|html)"',
      'deploy:requestumdemo': 'run-s build update-env:requestumdemo',
      'update-env:requestumdemo': 'bash bin/update-env/requestumdemo.sh .env.demo frontend/'
    },
    husky: {
      hooks: {
        'pre-commit': 'npm run pretty-quick && npm run lint:all'
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
        src: join(__dirname, '../../../specification/files/angular/default.conf'),
        dist: join(name, 'src/default.conf')
      },
      {
        src: join(__dirname, '../../../specification/files/angular/.eslintrc.json'),
        dist: join(name, '.eslintrc.json')
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
