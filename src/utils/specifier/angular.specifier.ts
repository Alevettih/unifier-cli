import { copy, outputFile, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { IPaths, Specifier } from '@utils/specifier';
import { cyan, red } from 'ansi-colors';
import { Listr, ListrTaskWrapper } from 'listr2';
import { command, ExecaReturnValue } from 'execa';
import { major } from 'semver';
import { IApplicationInfo, IContext } from '@src/main';
import * as deepMerge from 'deepmerge';
import { pascalCase, sentenceCase } from 'change-case';
import { getConfigsPaths } from '@utils/helpers/getters/get-configs-paths.helper';
import { getAngularJsonChanges } from '@utils/helpers/getters/get-angular-json-changes.helper';
import { getDependencies, getDevDependencies } from '@utils/helpers/getters/get-dependencies.helper';
import { getAppTemplatesPaths, getReadmeTemplatePath } from '@utils/helpers/getters/get-templates-paths.helper';
import { getPackageJsonChanges, scriptsToDelete } from '@utils/helpers/getters/get-package-json.helper';

export class AngularSpecifier extends Specifier {
  static readonly CONFIGS_DIR: string = './configs/angular/';
  private readonly _NG_COMMAND: string = 'node ./node_modules/@angular/cli/bin/ng';

  specify(): Listr {
    return new Listr([
      {
        title: `Update ${cyan('package.json')}`,
        task: async (ctx: IContext): Promise<void> =>
          this.mergeWithJson(join(ctx.title, 'package.json'), getPackageJsonChanges(ctx), scriptsToDelete)
      },
      {
        title: 'Install dependencies',
        task: (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          task.title = `Install dependencies by ${cyan(ctx.packageManager)}`;
          return this.installPackages(getDependencies(), getDevDependencies(ctx.skipGit));
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
              task: ({ title, type }: IContext): Listr => this.copyConfigs(...getConfigsPaths(type, title))
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

  copyConfigs(...configPaths: IPaths[]): Listr {
    return super.copyConfigs(...configPaths);
  }

  async updateReadme(ctx: IContext): Promise<void> {
    return this.applyTemplates([getReadmeTemplatePath(ctx.title)], {
      ...ctx,
      tokensNames: ctx.applicationsInfo.map(({ token }: IApplicationInfo): string => `\`${token}\``).join(' and '),
      noun: ctx.applicationsInfo.length > 1 ? 'files' : 'file',
      title: sentenceCase(ctx.title)
    });
  }

  async editAngularJson({ title, applicationsInfo }: IContext): Promise<void> {
    const pathToJson: string = join(title, 'angular.json');
    let angularJson: any = readJsonSync(pathToJson);

    angularJson = deepMerge(angularJson, getAngularJsonChanges(applicationsInfo), {
      arrayMerge: (target: any[], source: any[]): any[] => source
    });

    delete angularJson?.projects?.[title];

    return writeJson(pathToJson, angularJson, { spaces: 2 }).catch(err => {
      throw new Error(red(`JSON update failed: ${err}`));
    });
  }

  async copyBaseStructure({ title, applicationsInfo }: IContext): Promise<void> {
    await copy(join(__dirname, './codebase/angular'), join(title));

    this.removeFiles(
      join(title, `/src/main.ts`),
      join(title, `/src/index.html`),
      join(title, `/src/app/app.module.ts`),
      join(title, `/src/app/app-routing.module.ts`),
      join(title, `/src/app/app.component.ts`),
      join(title, `/src/app/app.component.spec.ts`),
      join(title, `/src/app/app.component.scss`),
      join(title, `/src/app/app.component.html`)
    );

    for (const app of applicationsInfo) {
      this.removeFiles(
        join(title, `/projects/${app.name}/.browserslistrc`),
        join(title, `/projects/${app.name}/.eslintrc.json`),
        join(title, `/projects/${app.name}/src/assets`),
        join(title, `/projects/${app.name}/src/environments`),
        join(title, `/projects/${app.name}/src/favicon.ico`),
        join(title, `/projects/${app.name}/src/polyfills.ts`),
        join(title, `/projects/${app.name}/src/styles.scss`)
      );
      await this.applyTemplates(getAppTemplatesPaths(title, app.name), {
        name: app.name,
        token: app.token,
        moduleName: `${pascalCase(app.name)}Module`,
        title: `${sentenceCase(title)} ${app.name === 'admin' ? `| ${sentenceCase(app.name)}` : ''}`.trim()
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
