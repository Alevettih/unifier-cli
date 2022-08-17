import { copy, outputFile, readJsonSync, removeSync, writeFile, writeJson } from 'fs-extra';
import { join } from 'path';
import { configsDir, IConfigPaths, Specifier } from '@utils/specifier';
import { cyan, red } from 'ansi-colors';
import config from '@utils/specifier/configs/angular.config';
import { Listr, ListrTaskWrapper } from 'listr2';
import { command, ExecaReturnValue } from 'execa';
import { major } from 'semver';
import { IApplicationInfo, IContext } from '@src/main';
import * as deepMerge from 'deepmerge';
import { readFileSync } from 'fs';
import mustache from 'mustache';

export class AngularSpecifier extends Specifier {
  private readonly _NG_COMMAND: string = 'node ./node_modules/@angular/cli/bin/ng';

  specify(): Listr {
    return new Listr([
      {
        title: `Update ${cyan('package.json')}`,
        task: async (ctx: IContext): Promise<void> =>
          this.mergeWithJson(
            join(ctx.title, 'package.json'),
            await config.packageJson.getChanges(ctx),
            config.packageJson.fieldsToDelete
          )
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
            },
            {
              title: `Update ${cyan('.gitignore')} rules`,
              task: (ctx: IContext): Promise<void> => this.updateGitignoreRules(ctx)
            },
            {
              title: `Update ${cyan('README.md')}`,
              task: (ctx: IContext): Promise<void> => this.updateReadme(ctx)
            },
            {
              title: 'Copy configs',
              task: ({ title }: IContext): Listr => this.copyConfigs(...config.getConfigsPaths(title))
            }
          ])
      },
      {
        title: 'Run Prettier',
        task: () => this.runPrettier()
      },
      {
        title: 'Run linters',
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

  async updateReadme(ctx: IContext): Promise<void> {
    const template: string = readFileSync(join(__dirname, configsDir, 'angular', 'README.mustache')).toString();
    const readme: string = mustache.render(template, {
      ...ctx,
      noun: (): string => (ctx.applicationsInfo.length > 1 ? 'files' : 'file'),
      tokensNames: (): string =>
        ctx.applicationsInfo.map(({ token }: IApplicationInfo): string => `\`${token}\``).join(' and ')
    });

    return writeFile(join(ctx.title, 'README.md'), readme);
  }

  async editAngularJson({ title, applicationsInfo }: IContext): Promise<void> {
    const pathToJson: string = join(title, 'angular.json');
    let angularJson: any = readJsonSync(pathToJson);

    angularJson = deepMerge(angularJson, config.getAngularJsonChanges(applicationsInfo), {
      arrayMerge: (target: any[], source: any[]): any[] => source
    });

    delete angularJson?.projects?.[title];

    return writeJson(pathToJson, angularJson, { spaces: 2 }).catch(err => {
      throw new Error(red(`JSON update failed: ${err}`));
    });
  }

  async copyBaseStructure({ title, applicationsInfo }: IContext): Promise<void> {
    await copy(join(__dirname, './codebase/angular/base'), join(title)).catch(err => {
      throw new Error(red(`Base structure copying failed: ${err}`));
    });
    removeSync(join(title, `/src/main.ts`));
    removeSync(join(title, `/src/index.html`));
    removeSync(join(title, `/src/app/app.module.ts`));
    removeSync(join(title, `/src/app/app-routing.module.ts`));
    ['ts', 'spec.ts', 'scss', 'html'].forEach((extension: string): void =>
      removeSync(join(title, `/src/app/app.component.${extension}`))
    );

    for (const app of applicationsInfo) {
      removeSync(join(title, `/projects/${app.name}`));
      await copy(
        join(__dirname, `./codebase/angular/projects/${app.name}`),
        join(title, `/projects/${app.name}`)
      ).catch(err => {
        throw new Error(red(`Base structure copying failed: ${err}`));
      });
      await copy(
        join(__dirname, `./codebase/angular/routing-modules/${app.name}`),
        join(title, `/src/app/modules/main/${app.name}`)
      ).catch(err => {
        throw new Error(red(`Base structure copying failed: ${err}`));
      });
    }
  }

  async addTokensToAssets({ title, applicationsInfo }: IContext): Promise<void> {
    for (const app of applicationsInfo) {
      await outputFile(join(title, `src/assets/${app.token}`), '"=03e"', 'utf-8').catch(err => {
        throw new Error(red(`${app.token} creation failed: ${err}`));
      });
    }
  }

  async generateApplications({ applicationsInfo }: IContext): Promise<void> {
    for (const app of applicationsInfo) {
      await command(`${this._NG_COMMAND} generate app ${app.name} --routing --style scss`, this.CHILD_PROCESS_OPTIONS);
    }
  }
}
