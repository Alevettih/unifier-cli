import { ConfigPaths } from '@utils/specifier';
import { join } from 'path';

export default {
  modules: [
    'stylelint',
    'stylelint-config-standard',
    'stylelint-declaration-strict-value',
    'stylelint-no-unsupported-browser-features',
    'stylelint-scss',
    'stylelint-z-index-value-constraint',
    'stylelint-processor-arbitrary-tags'
  ],
  packageJson: {
    scripts: {
      'lint:scss': 'stylelint "./src/**/*.vue"',
      'lint:all': 'npm run lint && npm run lint:scss'
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
