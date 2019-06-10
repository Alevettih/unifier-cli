import { Specifier } from '@specifier/index';

export class PlainJSSpecifier extends Specifier {
  async specify(): Promise<void> {
    await this.removeDefaultGit();
    await this.initGit();
    await Promise.all([
      await this.npmInstall(),
      await this.copyBrowserslistrc(),
      await this.copyEditorconfig()
    ]);
    await this.initialCommit();
  }
}
