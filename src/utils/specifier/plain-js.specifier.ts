import { Specifier } from '@specifier/index';
import config from '@specifier/configs/plain-js.config';

export class PlainJSSpecifier extends Specifier {
  async specify(): Promise<void> {
    await this.removeDefaultGit();
    await this.initGit();
    await Promise.all([
      this.copyConfigs(...config.getConfigsPaths(this.name)),
      this.updateGitignoreRules(),
      this.installPackages()
    ]);
    await this.initialCommit();
  }
}
