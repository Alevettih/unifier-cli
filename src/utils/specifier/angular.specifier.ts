import { copy, outputFile, removeSync } from 'fs-extra';
import { join } from 'path';
import * as angularJsonAdditions from '@specification/files/angular/angular.json';
import { ConfigPaths, Specifier } from '@utils/specifier';
import { blue, red } from 'colors/safe';
import config from '@utils/specifier/configs/angular.config';
import * as Listr from 'listr';
import { command, ExecaReturnValue } from 'execa';

export class AngularSpecifier extends Specifier {
  specify(): Listr {
    return new Listr([
      {
        title: `Update ${blue('package.json')}`,
        task: () => this.mergeWithJson(join(this.name, 'package.json'), config.packageJson)
      },
      { title: 'Install dependencies', task: () => this.installPackages(config.modules) },
      { title: 'Add Material', task: () => this.installMaterial() },
      { title: 'Add ESLint', task: () => this.installEsLint() },
      {
        title: 'Do some magic...',
        task: () =>
          new Listr(
            [
              { title: 'Copy configs...', task: () => this.copyConfigs(...config.getConfigsPaths(this.name)) },
              { title: 'Copy the base structure of project', task: () => this.copyBaseStructure() },
              { title: `Update ${blue('.gitignore')} rules`, task: () => this.updateGitignoreRules() },
              {
                title: `Add ${blue('token.json')} to assets directory. (Should be in ${blue('.gitignore')})`,
                task: () => this.addTokenJsonToAssets()
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

  installMaterial(): Promise<ExecaReturnValue> {
    return command(
      `npx --package @angular/cli ng add @angular/material@latest --skip-confirmation --verbose`,
      this.childProcessOptions
    ).catch(({ message }) => {
      throw new Error(red(`Material installing error: ${message}`));
    });
  }

  installEsLint(): Promise<ExecaReturnValue> {
    return command(
      `npx --package @angular/cli ng add @angular-eslint/schematics@latest --skip-confirmation --verbose`,
      this.childProcessOptions
    ).catch(({ message }) => {
      throw new Error(red(`ESLint installing error: ${message}`));
    });
  }

  copyConfigs(...configPaths: ConfigPaths[]): Listr {
    removeSync(join(this.name, '/browserslist'));
    return super.copyConfigs(...configPaths);
  }

  copyBaseStructure(): Promise<void> {
    return copy(join(__dirname, '../../codebase/angular'), join(this.name)).catch(err => {
      throw new Error(red(`Base structure copying failed: ${err}`));
    });
  }

  addTokenJsonToAssets(): Promise<void> {
    return outputFile(join(this.name, 'src/assets/token.json'), '"=03e"', 'utf-8').catch(err => {
      throw new Error(red(`token.json creation failed: ${err}`));
    });
  }
}
