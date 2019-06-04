import { LinterConfig, Specifier } from "@specifier/index";

export class VueSpecifier extends Specifier {
  async specify() {
    await Promise.all([
      this.copyEditorconfig(),
      this.copyBrowserslistrc(),
      this.copyStylelintrc()
    ]);
    await this.initialCommit();
  }

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
  }
}
