import { Specifier } from "@specifier/index";

export class VueSpecifier extends Specifier {
  async specify() {
    await Promise.all([
      this.copyEditorconfig(),
      this.copyBrowserslistrc(),
      this.copyStylelintrc()
    ]);
    await this.initialCommit();
  }
}
