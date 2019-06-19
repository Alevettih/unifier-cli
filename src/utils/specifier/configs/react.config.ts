import { ConfigPaths } from '@utils/specifier';
import { join } from 'path';

export default {
  modules: [
    'node-sass',

    'husky',

    'stylelint',
    'stylelint-config-standard',
    'stylelint-declaration-strict-value',
    'stylelint-no-unsupported-browser-features',
    'stylelint-scss',
    'stylelint-z-index-value-constraint',

    'eslint',
    'eslint-config-airbnb',
    'eslint-plugin-compat',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'eslint-plugin-jest'
  ],
  packageJson: {
    scripts: {
      'lint:scss': 'stylelint "./src/**/*.scss"',
      'lint:es': 'eslint "./src/**/*.js"',
      'lint:all': 'npm run lint:es && npm run lint:scss'
    },
    browserslist: undefined,
    husky: {
      hooks: {
        'pre-commit': 'npm run lint:all'
      }
    }
  },
  getConfigsPaths(name: string): ConfigPaths[] {
    return [
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
