import { LinterConfig, Specifier } from '@specifier/index';
import { remove } from 'fs-extra';
import { join } from 'path';

export class VueSpecifier extends Specifier {

  stylelint: LinterConfig = {
    modules: [
      'stylelint',
      'stylelint-config-standard',
      'stylelint-declaration-strict-value',
      'stylelint-no-unsupported-browser-features',
      'stylelint-scss',
      'stylelint-z-index-value-constraint',
      'stylelint-processor-arbitrary-tags'
    ],
    script: 'stylelint "./src/**/*.vue"',
    path: '../../specification/files/vue/.stylelintrc'
  };

  eslint: LinterConfig = {
    path: '../../specification/files/vue/.eslintrc'
  };

  async specify() {
    await this.initGit();
    await this.npmInstall([...this.stylelint.modules]);
    await Promise.all([
      this.copyEditorconfig(),
      this.copyBrowserslistrc(),
      this.copyStylelintrc(),
      this.copyEslintrc()
    ]);
    await this.initialCommit();
  }

  copyEslintrc(): Promise < void > {
    return remove(join(this.name, '.eslintrc.js')).then(() => super.copyEslintrc());
  }
}
