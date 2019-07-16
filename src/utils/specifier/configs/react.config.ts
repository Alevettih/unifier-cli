import { ConfigPaths } from '@utils/specifier';
import { join } from 'path';

export default {
  modules: [
    'node-sass',

    'husky',

    'prettier',
    'pretty-quick',
    'onchange',

    'stylelint',
    'stylelint-config-standard',
    'stylelint-declaration-strict-value',
    'stylelint-no-unsupported-browser-features',
    'stylelint-scss',
    'stylelint-z-index-value-constraint',

    'eslint-config-airbnb',
    'eslint-config-prettier',
    'eslint-plugin-compat',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'eslint-plugin-jest'
  ],
  packageJson: {
    scripts: {
      'lint:scss': 'stylelint "./src/**/*.scss" --fix',
      'lint:scss:watch': 'onchange "src/**/*.scss" -- stylelint {{changed}}',
      'lint:es': 'eslint "./src/**/*.js" --fix',
      'lint:es:watch': 'onchange "src/**/*.js" -- eslint {{changed}}',
      'lint:all': 'npm run lint:es && npm run lint:scss'
    },
    browserslist: undefined,
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
        src: join(__dirname, '../../../specification/files/.editorconfig'),
        dist: join(name, '.editorconfig')
      },
      {
        src: join(__dirname, '../../../specification/files/.browserslistrc'),
        dist: join(name, '.browserslistrc')
      },
      {
        src: join(__dirname, '../../../specification/files/.stylelintrc'),
        dist: join(name, '.stylelintrc')
      },
      {
        src: join(__dirname, '../../../specification/files/react/.eslintrc'),
        dist: join(name, '.eslintrc')
      }
    ];
  }
};
