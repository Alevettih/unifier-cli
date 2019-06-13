import { Specifier } from '@specifier/index';

export class PlainJSSpecifier extends Specifier {
  async specify(): Promise<void> {
    await this.removeDefaultGit();
    await this.initGit();
    await Promise.all([
      this.copyBrowserslistrc(),
      this.copyEditorconfig(),
      this.copyStylelintrc(),
      this.copyEslintrc(),
      this.npmInstall()
    ]);
    await this.initialCommit();
  }
}
