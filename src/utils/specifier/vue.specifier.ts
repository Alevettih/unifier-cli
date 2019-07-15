import { ConfigPaths, Specifier } from '@specifier/index';
import { removeSync } from 'fs-extra';
import { join } from 'path';
import config from '@utils/specifier/configs/vue.config';
import * as Listr from 'listr';
import { blue } from 'colors/safe';

export class VueSpecifier extends Specifier {
  specify() {
    return new Listr([
      { title: 'Install dependencies', task: () => this.installPackages(config.modules) },
      {
        title: 'Do some magic...',
        task: () =>
          new Listr(
            [
              { title: 'Copy configs...', task: () => this.copyConfigs(...config.getConfigsPaths(this.name)) },
              { title: `Add ${blue('config.js')} file`, task: () => this.addConfigJs() },
              {
                title: `Add link to ${blue('config.js')} in ${blue('index.html')}`,
                task: () => this.addLinkToConfigJsInHtml()
              },
              { title: `Update ${blue('.gitignore')} rules`, task: () => this.updateGitignoreRules() },
              {
                title: `Edit ${blue('package.json')}`,
                task: () => this.mergeWithJson(join(this.name, 'package.json'), config.packageJson)
              }
            ],
            { concurrent: true }
          )
      },
      {
        title: 'Do initial commit',
        task: () => this.initialCommit(true)
      }
    ]);
  }

  copyConfigs(...configsPaths: ConfigPaths[]): Listr {
    removeSync(join(this.name, '.eslintrc.js'));
    return super.copyConfigs(...configsPaths);
  }
}
