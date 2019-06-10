import { LinterConfig, Specifier } from '@specifier/index';

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
  async specify() {
    await this.initGit();
    await this.npmInstall([...this.stylelint.modules]);
    await Promise.all([
      this.copyEditorconfig(),
      this.copyBrowserslistrc(),
      this.copyStylelintrc()
    ]);
    await this.initialCommit();
  }
}
