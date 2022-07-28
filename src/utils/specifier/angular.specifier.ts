import { copy, outputFile, removeSync } from 'fs-extra';
import { join } from 'path';
import * as angularJsonAdditions from '@configs/angular/angular.json';
import { IConfigPaths, Specifier } from '@utils/specifier';
import { cyan, red } from 'ansi-colors';
import config from '@utils/specifier/configs/angular.config';
import { Listr } from 'listr2';
import { command, ExecaReturnValue } from 'execa';
import { major } from 'semver';

export class AngularSpecifier extends Specifier {
  private readonly _NG_COMMAND: string = 'node ./node_modules/@angular/cli/bin/ng';

  specify(): Listr {
    const tasks = [
      {
        title: `Update ${cyan('package.json')}`,
        task: () => this.mergeWithJson(join(this.name, 'package.json'), config.packageJson(this.name, this.SKIP_GIT))
      },
      {
        title: 'Install dependencies',
        task: () => this.installPackages(config.dependencies, config.devDependencies(this.SKIP_GIT))
      },
      { title: 'Add Material', task: () => this.installMaterial(this.VERSION) },
      { title: 'Add ESLint', task: () => this.installEsLint(this.VERSION) },
      {
        title: 'Do some magic...',
        task: () =>
          new Listr(
            [
              { title: 'Copy configs...', task: () => this.copyConfigs(...config.getConfigsPaths(this.name)) },
              { title: 'Copy the base structure of project', task: () => this.copyBaseStructure() },
              { title: `Update ${cyan('.gitignore')} rules`, task: () => this.updateGitignoreRules() },
              {
                title: `Add ${cyan('token.json')} to assets directory. (Should be in ${cyan('.gitignore')})`,
                task: () => this.addTokenJsonToAssets()
              },
              {
                title: `Edit ${cyan('angular.json')}`,
                task: () =>
                  this.mergeWithJson(join(this.name, 'angular.json'), {
                    projects: { [this.name]: { ...angularJsonAdditions } }
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
      }
    ];

    if (!this.SKIP_GIT) {
      tasks.push({
        title: 'Do initial commit',
        task: () => this.initialCommit(true)
      });
    }

    return new Listr(tasks);
  }

  installMaterial(version: string): Promise<ExecaReturnValue> {
    return command(
      `${this._NG_COMMAND} add @angular/material@${version ? major(version) : 'latest'} --skip-confirmation --verbose`,
      this.CHILD_PROCESS_OPTIONS
    );
  }

  installEsLint(version: string): Promise<ExecaReturnValue> {
    return command(
      `${this._NG_COMMAND} add @angular-eslint/schematics@${
        version ? major(version) : 'latest'
      } --skip-confirmation --verbose`,
      this.CHILD_PROCESS_OPTIONS
    );
  }

  copyConfigs(...configPaths: IConfigPaths[]): Listr {
    removeSync(join(this.name, '/browserslist'));
    return super.copyConfigs(...configPaths);
  }

  copyBaseStructure(): Promise<void> {
    return copy(join(__dirname, './codebase/angular'), join(this.name)).catch(err => {
      throw new Error(red(`Base structure copying failed: ${err}`));
    });
  }

  addTokenJsonToAssets(): Promise<void> {
    return outputFile(join(this.name, 'src/assets/token.json'), '"=03e"', 'utf-8').catch(err => {
      throw new Error(red(`token.json creation failed: ${err}`));
    });
  }
}
