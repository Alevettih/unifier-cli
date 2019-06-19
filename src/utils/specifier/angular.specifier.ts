import { copy, outputFile, remove } from 'fs-extra';
import { join } from 'path';
import * as angularJsonAdditions from '@specification/files/angular/angular.json';
import { ConfigPaths, Specifier } from '@utils/specifier';
import { green, red } from 'colors/safe';
import config from '@utils/specifier/configs/angular.config';

export class AngularSpecifier extends Specifier {
  async specify(): Promise<void> {
    await this.initGit();
    await this.npmInstall(config.modules);
    await Promise.all([
      this.copyConfigs(...config.getConfigsPaths(this.name)),
      this.copyBaseStructure(),
      this.addConfigJsonToAssets(),
      this.updateGitignoreRules(),
      this.mergeWithJson(
        join(this.name, 'package.json'),
        config.packageJson
      ),
      this.mergeWithJson(
        join(this.name, 'angular.json'),
        {projects: {[this.name]: angularJsonAdditions}}
      )
    ]);
    await this.initialCommit();
  }

  copyConfigs(...configPaths: ConfigPaths[]): Promise<void> {
    return remove(
      join(this.name, 'src/browserslist')
    ).then(
      () => super.copyConfigs(...configPaths),
      (err) => {throw new Error(red(`.browserslistrc copying failed: ${err}`)); }
    );
  }

  copyBaseStructure(): Promise<void> {
    return copy(
      join(__dirname, '../../codebase/angular'),
      join(this.name, 'src')
    ).then(
      () => { console.log(green('Base structure successfully copied!')); },
      (err) => { throw new Error(red(`Base structure copying failed: ${err}`)); }
    );
  }

  addConfigJsonToAssets(): Promise<void> {
    return outputFile(
      join(this.name, 'src/assets/config.json'),
      '{}',
      'utf-8'
    ).then(
      () => { console.log(green('config.json successfully created!')); },
      (err) => { throw new Error(red(`config.json creation failed: ${err}`)); }
    );
  }
}
