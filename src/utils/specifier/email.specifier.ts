import { Specifier } from '@specifier/index';
import config from '@specifier/configs/plain-js.config';

export class EmailSpecifier extends Specifier {
  async specify(): Promise<void> {
    await this.removeDefaultGit();
    await Promise.all([this.initGit(), this.updateGitignoreRules(), this.npmInstall()]);
    await this.initialCommit();
  }
}
