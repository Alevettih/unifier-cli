import { copy, outputFile, removeSync } from 'fs-extra';
import { join } from 'path';
import * as angularJsonAdditions from '@configs/angular/angular.json';
import { IConfigPaths, Specifier } from '@utils/specifier';
import { cyan, red } from 'ansi-colors';
import config from '@utils/specifier/configs/angular.config';
import { Listr, ListrTaskWrapper } from 'listr2';
import { command, ExecaReturnValue } from 'execa';
import { major } from 'semver';
import { IContext } from '@src/main';

export class AngularSpecifier extends Specifier {
  private readonly _NG_COMMAND: string = 'node ./node_modules/@angular/cli/bin/ng';

  specify(): Listr {
    return new Listr([
      {
        title: `Update ${cyan('package.json')}`,
        task: ({ skipGit, title }: IContext): Promise<void> =>
          this.mergeWithJson(join(title, 'package.json'), config.packageJson(title, skipGit))
      },
      {
        title: 'Install dependencies',
        task: (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          task.title = `Install dependencies by ${cyan(ctx.packageManager)}`;
          return this.installPackages(config.dependencies, config.devDependencies(ctx.skipGit));
        }
      },
      {
        title: 'Add Material',
        task: ({ version }: IContext): Promise<ExecaReturnValue> => this.installMaterial(version)
      },
      { title: 'Add ESLint', task: ({ version }: IContext): Promise<ExecaReturnValue> => this.installEsLint(version) },
      {
        title: 'Do some magic...',
        task: () =>
          new Listr(
            [
              {
                title: `Remove default ${cyan('browserslist')}`,
                task: ({ title }: IContext): void => removeSync(join(title, '/browserslist'))
              },
              {
                title: 'Copy configs...',
                task: ({ title }: IContext): Listr => this.copyConfigs(...config.getConfigsPaths(title))
              },
              {
                title: 'Copy the base structure of project',
                task: (ctx: IContext): Promise<void> => this.copyBaseStructure(ctx)
              },
              {
                title: `Update ${cyan('.gitignore')} rules`,
                task: (ctx: IContext): Promise<void> => this.updateGitignoreRules(ctx)
              },
              {
                title: `Add ${cyan('token.json')} to assets directory. (Should be in ${cyan('.gitignore')})`,
                task: (ctx: IContext): Promise<void> => this.addTokenJsonToAssets(ctx)
              },
              {
                title: `Edit ${cyan('angular.json')}`,
                task: ({ title }: IContext) =>
                  this.mergeWithJson(join(title, 'angular.json'), {
                    projects: { [title]: { ...angularJsonAdditions } }
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
        enabled: ({ skipGit }: IContext): boolean => !skipGit,
        task: () => this.initialCommit(true)
      }
    ]);
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
    return super.copyConfigs(...configPaths);
  }

  copyBaseStructure({ title }: IContext): Promise<void> {
    return copy(join(__dirname, './codebase/angular'), join(title)).catch(err => {
      throw new Error(red(`Base structure copying failed: ${err}`));
    });
  }

  addTokenJsonToAssets({ title }: IContext): Promise<void> {
    return outputFile(join(title, 'src/assets/token.json'), '"=03e"', 'utf-8').catch(err => {
      throw new Error(red(`token.json creation failed: ${err}`));
    });
  }
}
