import { copy, outputFile, removeSync } from 'fs-extra';
import { join } from 'path';
import * as angularJsonAdditions from '@specification/files/angular/angular.json';
import { ConfigPaths, Specifier } from '@utils/specifier';
import { blue, red } from 'colors/safe';
import config from '@utils/specifier/configs/angular.config';
import * as Listr from 'listr';

export class AngularSpecifier extends Specifier {
  specify(): Listr {
    return new Listr([
      { title: 'Install dependencies', task: () => this.installPackages(config.modules) },
      {
        title: 'Do some magic...',
        task: () =>
          new Listr(
            [
              { title: 'Copy configs...', task: () => this.copyConfigs(...config.getConfigsPaths(this.name)) },
              { title: 'Copy the base structure of project', task: () => this.copyBaseStructure() },
              { title: `Add ${blue('config.json')} to assets directory`, task: () => this.addConfigJsonToAssets() },
              { title: `Update ${blue('.gitignore')} rules`, task: () => this.updateGitignoreRules() },
              {
                title: `Edit ${blue('package.json')}`,
                task: () => this.mergeWithJson(join(this.name, 'package.json'), config.packageJson)
              },
              {
                title: `Edit ${blue('angular.json')}`,
                task: () =>
                  this.mergeWithJson(join(this.name, 'angular.json'), {
                    projects: { [this.name]: angularJsonAdditions }
                  })
              }
            ],
            { concurrent: true }
          )
      },
      {
        title: 'Run Prettier',
        task: () => this.runPrettier()
      },
      {
        title: 'Linters',
        task: () => this.lintersTask()
      },
      {
        title: 'Do initial commit',
        task: () => this.initialCommit(true)
      }
    ]);
  }

  copyConfigs(...configPaths: ConfigPaths[]): Listr {
    removeSync(join(this.name, 'src/browserslist'));
    return super.copyConfigs(...configPaths);
  }

  copyBaseStructure(): Promise<void> {
    return copy(join(__dirname, '../../codebase/angular'), join(this.name, 'src')).catch(err => {
      throw new Error(red(`Base structure copying failed: ${err}`));
    });
  }

  addConfigJsonToAssets(): Promise<void> {
    return outputFile(join(this.name, 'src/assets/config.json'), '{}', 'utf-8').catch(err => {
      throw new Error(red(`config.json creation failed: ${err}`));
    });
  }
}
