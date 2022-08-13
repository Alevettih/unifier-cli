import { copy, outputFile, readJsonSync, removeSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { IConfigPaths, Specifier } from '@utils/specifier';
import { cyan, red } from 'ansi-colors';
import config from '@utils/specifier/configs/angular.config';
import { Listr, ListrTaskWrapper } from 'listr2';
import { command, ExecaReturnValue } from 'execa';
import { major } from 'semver';
import { IContext } from '@src/main';
import * as deepMerge from 'deepmerge';

export class AngularSpecifier extends Specifier {
  private readonly _NG_COMMAND: string = 'node ./node_modules/@angular/cli/bin/ng';

  specify(): Listr {
    return new Listr([
      {
        title: `Update ${cyan('package.json')}`,
        task: async (ctx: IContext): Promise<void> =>
          this.mergeWithJson(join(ctx.title, 'package.json'), await config.getPackageJsonChanges(ctx))
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
      {
        title: 'Add ESLint',
        task: ({ version }: IContext): Promise<ExecaReturnValue> => this.installEsLint(version)
      },
      {
        title: 'Setup codebase',
        task: () =>
          new Listr([
            {
              title: 'Generate application(s)',
              task: (ctx: IContext): Promise<void> => this.generateApplications(ctx)
            },
            {
              title: 'Copy the base structure of project',
              task: (ctx: IContext): Promise<void> => this.copyBaseStructure(ctx)
            },
            {
              title: `Add token(s) to assets directory. (Should be in ${cyan('.gitignore')})`,
              task: (ctx: IContext): Promise<void> => this.addTokensToAssets(ctx)
            },
            {
              title: `Edit ${cyan('angular.json')}`,
              task: (ctx: IContext) => this.editAngularJson(ctx)
            }
          ])
      },
      {
        title: 'Copy configs...',
        task: ({ title }: IContext): Listr => this.copyConfigs(...config.getConfigsPaths(title))
      },
      {
        title: `Update ${cyan('.gitignore')} rules`,
        task: (ctx: IContext): Promise<void> => this.updateGitignoreRules(ctx)
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

  async editAngularJson({ title, applications }: IContext): Promise<void> {
    const pathToJson: string = join(title, 'angular.json');
    let angularJson: any = readJsonSync(pathToJson);

    angularJson = deepMerge(angularJson, config.getAngularJsonChanges(applications), {
      arrayMerge: (target: any[], source: any[]): any[] => source
    });

    delete angularJson?.projects?.[title];

    return writeJson(pathToJson, angularJson, { spaces: 2 }).catch(err => {
      throw new Error(red(`JSON update failed: ${err}`));
    });
  }

  async copyBaseStructure({ title, applications }: IContext): Promise<void> {
    await copy(join(__dirname, './codebase/angular/base'), join(title)).catch(err => {
      throw new Error(red(`Base structure copying failed: ${err}`));
    });
    removeSync(join(title, `/src/main.ts`));
    removeSync(join(title, `/src/index.html`));

    for (const app of applications) {
      removeSync(join(title, `/projects/${app}`));
      await copy(join(__dirname, `./codebase/angular/projects/${app}`), join(title, `/projects/${app}`)).catch(err => {
        throw new Error(red(`Base structure copying failed: ${err}`));
      });
      await copy(
        join(__dirname, `./codebase/angular/routing-modules/${app}`),
        join(title, `/src/app/modules/main/${app}`)
      ).catch(err => {
        throw new Error(red(`Base structure copying failed: ${err}`));
      });
    }
  }

  async addTokensToAssets({ title, applications }: IContext): Promise<void> {
    for (const app of applications) {
      const filename: string = `token.${app}.json`;

      await outputFile(join(title, `src/assets/${filename}`), '"=03e"', 'utf-8').catch(err => {
        throw new Error(red(`${filename} creation failed: ${err}`));
      });
    }
  }

  async generateApplications({ applications }: IContext): Promise<void> {
    for (const app of applications) {
      await command(`${this._NG_COMMAND} generate app ${app} --routing --style scss`, this.CHILD_PROCESS_OPTIONS);
    }
  }
}
