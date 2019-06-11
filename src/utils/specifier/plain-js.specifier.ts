import { Specifier } from '@specifier/index';

export class PlainJSSpecifier extends Specifier {
  async specify(): Promise<void> {
    await this.removeDefaultGit();
    await this.initGit();
    await Promise.all([
      await this.copyBrowserslistrc(),
      await this.copyEditorconfig(),
      await this.copyStylelintrc(),
      await this.copyEslintrc(),
      await this.npmInstall()
    ]);
    await this.initialCommit();
  }
}
