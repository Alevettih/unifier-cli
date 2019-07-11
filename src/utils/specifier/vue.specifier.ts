import { ConfigPaths, Specifier } from '@specifier/index';
import { remove } from 'fs-extra';
import { join } from 'path';
import config from '@utils/specifier/configs/vue.config';

export class VueSpecifier extends Specifier {
  async specify() {
    await this.installPackages(config.modules);
    await Promise.all([
      this.copyConfigs(...config.getConfigsPaths(this.name)),
      this.addConfigJs(),
      this.updateGitignoreRules(),
      this.addLinkToConfigJsInHtml(),
      this.mergeWithJson(join(this.name, 'package.json'), config.packageJson)
    ]);
    await this.initialCommit(true);
  }

  copyConfigs(...configsPaths: ConfigPaths[]): Promise<void> {
    return remove(join(this.name, '.eslintrc.js')).then(() => super.copyConfigs(...configsPaths));
  }
}
