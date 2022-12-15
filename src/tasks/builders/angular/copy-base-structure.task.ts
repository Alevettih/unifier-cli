import { join } from 'path';
import { major } from 'semver';
import { copySync } from 'fs-extra';
import { ListrTaskWrapper } from 'listr2';
import { pascalCase, sentenceCase } from 'change-case';
import { AppType } from '@type/app-type.type';
import { IPaths } from '@interface/paths.interface';
import { IAppInfo } from '@interface/app-info.interface';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { removeFilesTask } from '@tasks/builders/remove-files.task';
import { applyTemplatesTask } from '@tasks/builders/apply-templates.task';

export function copyBaseStructureTask(ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>): void {
  const { title, applicationsInfo, directories, version }: IAppContext = ctx;
  task.output = OutputFormatter.info('Copy codebase files...');
  copySync(join(directories.base.codebase, 'files'), join(title));

  task.output = OutputFormatter.info(`Remove useless files in ${OutputFormatter.accent('./src')} folder...`);
  removeFilesTask(
    [
      join(title, `/tsconfig.app.json`),
      join(title, `/tsconfig.spec.json`),
      join(title, `/src/main.ts`),
      join(title, `/src/index.html`),
      join(title, `/src/app/app.module.ts`),
      join(title, `/src/app/app-routing.module.ts`),
      join(title, `/src/app/app.component.ts`),
      join(title, `/src/app/app.component.spec.ts`),
      join(title, `/src/app/app.component.scss`),
      join(title, `/src/app/app.component.html`)
    ],
    task
  );

  for (const app of applicationsInfo) {
    task.output = OutputFormatter.info(
      `Remove useless files in ${OutputFormatter.accent(`./projects/${app.name}`)} folder...`
    );
    removeFilesTask(
      [
        join(title, `/projects/${app.name}/.browserslistrc`),
        join(title, `/projects/${app.name}/.eslintrc.json`),
        join(title, `/projects/${app.name}/src/assets`),
        join(title, `/projects/${app.name}/src/environments`),
        join(title, `/projects/${app.name}/src/favicon.ico`),
        join(title, `/projects/${app.name}/src/polyfills.ts`),
        join(title, `/projects/${app.name}/src/styles.scss`)
      ],
      task
    );

    task.output = OutputFormatter.info(`Generate files for ${app.name} project...`);
    applyTemplatesTask(
      getTemplatesPaths(ctx, app.name),
      {
        name: app.name,
        token: app.token,
        moduleName: `${pascalCase(app.name)}Module`,
        title: `${sentenceCase(title)} ${app.name === 'admin' ? `| ${sentenceCase(app.name)}` : ''}`.trim(),
        shouldNotUsePolyfillsJs: major(version) >= 15
      },
      task
    );
  }

  applyTemplatesTask(
    [{ src: join(directories.angular.templates, 'README.md.hbs'), dist: join(title, 'README.md') }],
    {
      ...ctx,
      tokensNames: applicationsInfo.map(({ token }: IAppInfo): string => `\`${token}\``).join(' and '),
      noun: applicationsInfo.length > 1 ? 'files' : 'file',
      title: sentenceCase(title)
    },
    task
  );
}

function getTemplatesPaths({ title, directories: { angular } }: IAppContext, app: AppType): IPaths[] {
  return [
    getSrcTemplatePath('tsconfig.app.json'),
    getSrcTemplatePath('tsconfig.spec.json'),
    getSrcTemplatePath('src/index.html'),
    getSrcTemplatePath('src/main.ts'),
    getSrcTemplatePath('src/app/app.component.html'),
    getSrcTemplatePath('src/app/app.component.scss'),
    getSrcTemplatePath('src/app/app.component.ts'),
    getSrcTemplatePath('src/app/app.module.ts'),
    getSrcTemplatePath('src/app/app-routing.module.ts'),
    {
      src: join(angular.templates, 'project.module.ts.hbs'),
      dist: join(title, `/src/app/modules/main/${app}/${app}.module.ts`)
    }
  ];

  function getSrcTemplatePath(fileName: string): IPaths {
    return {
      src: join(angular.templates, 'project', `${fileName}.hbs`),
      dist: join(title, 'projects', app, fileName)
    };
  }
}
