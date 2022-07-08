import { join } from 'path';
import { ConfigPaths } from '@utils/specifier';

export default {
  devDependencies: [
    '@types/lodash.get',
    '@types/lodash.set',
    '@types/lodash.transform',
    '@types/lodash.isequal',

    'eslint-plugin-prettier',
    'eslint-config-prettier',

    'husky',

    'npm-run-all',

    'prettier',
    'pretty-quick',

    'postcss',
    'postcss-scss',

    'stylelint',
    'stylelint-config-standard',
    'stylelint-declaration-strict-value',
    'stylelint-no-unsupported-browser-features',
    'stylelint-scss',

    'tslint-config-prettier'
  ],
  dependencies: [
    'lodash.get',
    'lodash.set',
    'lodash.transform',
    'lodash.isequal',

    '@ngx-translate/core',
    '@ngx-translate/http-loader',
    'ngx-pagination',
    'ngx-infinite-scroll',

    'class-transformer',

    'reset-css'
  ],
  packageJson(projectName: string) {
    return {
      scripts: {
        'start:ssl': 'ng serve --ssl',
        'config:to-base64': 'node ./bin/to-base64.js',
        'config:from-base64': 'node ./bin/from-base64.js',
        lint: 'ng lint --fix',
        build: 'ng build',
        'lint:scss': 'stylelint "./src/**/*.scss" --fix',
        'lint:all': 'npm run lint && npm run lint:scss',
        prettier: 'prettier --write "src/**/*.*(ts|js|json|html)"',
        'pretty-quick': 'pretty-quick --staged --pattern "src/**/*.*(ts|js|json|html)"',
        'deploy:dev': 'run-s build update-env:dev',
        'update-env:dev': `bash bin/update-env/ssh-deploy.sh .env.dev ${projectName}/`,
        'hook:pre-commit': 'npm run pretty-quick',
        prepare: 'husky install && husky set .husky/pre-commit "npm run hook:pre-commit"'
      },
      husky: {
        hooks: {
          'pre-commit': 'npm run pretty-quick && npm run lint:all'
        }
      }
    };
  },
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
        src: join(__dirname, '../files/angular/.htaccess'),
        dist: join(name, 'src/.htaccess')
      },
      {
        src: join(__dirname, '../files/angular/default.conf'),
        dist: join(name, 'src/default.conf')
      },
      {
        src: join(__dirname, '../files/angular/.eslintrc.json'),
        dist: join(name, '.eslintrc.json')
      },
      {
        src: join(__dirname, '../files/angular/tsconfig.json'),
        dist: join(name, 'tsconfig.json')
      },
      {
        src: join(__dirname, '../files/.browserslistrc'),
        dist: join(name, '.browserslistrc')
      },
      {
        src: join(__dirname, '../files/.editorconfig'),
        dist: join(name, '.editorconfig')
      },
      {
        src: join(__dirname, '../files/angular/.stylelintrc'),
        dist: join(name, '.stylelintrc')
      }
    ];
  }
};
