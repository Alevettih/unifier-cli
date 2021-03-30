import { ConfigPaths } from '@utils/specifier';
import { join } from 'path';

export default {
  modules: [
    'prettier',
    'pretty-quick',

    'eslint-plugin-compat',

    'stylelint',
    'stylelint-config-standard',
    'stylelint-declaration-strict-value',
    'stylelint-no-unsupported-browser-features',
    'stylelint-scss',
    '@mapbox/stylelint-processor-arbitrary-tags'
  ],
  packageJson: {
    scripts: {
      lint: 'vue-cli-service lint --fix',
      'lint:scss': 'stylelint "./src/**/*.vue" --fix',
      'lint:scss:watch': 'onchange "src/**/*.scss" -- stylelint {{changed}}',
      'lint:all': 'npm run lint && npm run lint:scss'
    },
    gitHooks: {
      'pre-commit': 'pretty-quick --staged; lint-staged'
    },
    'lint-staged': {
      '*.{js,vue}': ['npm run lint:all', 'git add']
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
        src: join(__dirname, '../../../specification/files/.editorconfig'),
        dist: join(name, '.editorconfig')
      },
      {
        src: join(__dirname, '../../../specification/files/.browserslistrc'),
        dist: join(name, '.browserslistrc')
      },
      {
        src: join(__dirname, '../../../specification/files/vue/.stylelintrc'),
        dist: join(name, '.stylelintrc')
      },
      {
        src: join(__dirname, '../../../specification/files/vue/.eslintrc'),
        dist: join(name, '.eslintrc')
      }
    ];
  }
};
