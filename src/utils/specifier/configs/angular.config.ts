import { join } from 'path';
import { IConfigPaths } from '@utils/specifier';
import { configsDir } from '@utils/specifier';

export default {
  devDependencies(skipGit: boolean = false) {
    const devDependencies = [
      '@types/lodash.get',
      '@types/lodash.set',
      '@types/lodash.transform',
      '@types/lodash.isequal',

      'eslint-plugin-prettier',
      'eslint-config-prettier',

      'npm-run-all',

      'prettier',

      'postcss',
      'postcss-scss',

      'stylelint',
      'stylelint-config-standard',
      'stylelint-declaration-strict-value',
      'stylelint-no-unsupported-browser-features',
      'stylelint-scss',

      'tslint-config-prettier'
    ];

    if (!skipGit) {
      devDependencies.push('pretty-quick', 'husky');
    }

    return devDependencies;
  },
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
  packageJson(projectName: string, skipGit: boolean = false) {
    const packageJson = {
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
        prepare: 'npm run husky install && npm run husky set .husky/pre-commit "npm run hook:pre-commit"',
        husky: 'node node_modules/husky/lib/bin.js'
      },
      husky: {
        hooks: {
          'pre-commit': 'npm run pretty-quick && npm run lint:all'
        }
      }
    };

    if (skipGit) {
      delete packageJson.husky;
      delete packageJson.scripts.prepare;
      delete packageJson.scripts['pretty-quick'];
      delete packageJson.scripts['hook:pre-commit'];
    }

    return packageJson;
  },
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
};
