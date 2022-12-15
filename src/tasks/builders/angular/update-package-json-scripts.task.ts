import { join } from 'path';
import { ListrTaskWrapper } from 'listr2';
import { readJsonSync, writeJsonSync } from 'fs-extra';
import { IAppInfo } from '@interface/app-info.interface';
import { IAppContext } from '@interface/app-context.interface';
import { IPackageJson, IUnknownParams } from '@interface/package-json.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';

export function updatePackageJsonScriptsTask(
  { skipGit, applicationsInfo, title, directories: { base } }: IAppContext,
  task: ListrTaskWrapper<IAppContext, any>
): void {
  task.output = OutputFormatter.info(`Getting ${OutputFormatter.accent('package.json')} files...`);
  const codebasePackageJson: IPackageJson = readJsonSync(join(base.codebase, 'package.json'));
  const packageJson: IPackageJson = readJsonSync(join(title, 'package.json'));
  const scriptsToRemove: string[] = ['watch', 'test', 'start', 'start:ssl', 'build'];
  const gitDependentScripts: string[] = ['prepare', 'hook:pre-commit', 'pretty-quick'];

  task.output = OutputFormatter.info(`Removing useless scripts...`);
  const scripts: IUnknownParams = Object.entries(JSON.parse(JSON.stringify(codebasePackageJson.scripts)))
    .filter(
      ([key]: [string, string]): boolean =>
        !scriptsToRemove.includes(key) || (skipGit && !gitDependentScripts.includes(key))
    )
    .reduce((prev: IUnknownParams, [key, value]: [string, string]): IUnknownParams => {
      prev[key] = value.replace(/\.\/files\//gm, './');
      return prev;
    }, {});

  task.output = OutputFormatter.info(`Generate projects scripts...`);
  applicationsInfo.forEach(({ name, port }: IAppInfo): void => {
    scripts[`test:${name}`] = `ng test ${name}`;
    scripts[`build:${name}`] = `ng build ${name}`;
    scripts[`watch:${name}`] = `ng build ${name} --watch --configuration development`;
    scripts[`start:${name}`] = `ng serve ${name} --port=${port}`;
    scripts[`start:${name}:ssl`] = `ng serve ${name} --ssl --port=${port}`;
  });

  if (applicationsInfo.length > 1) {
    scripts[`build:all`] = `run-p ${applicationsInfo.map(({ name }: IAppInfo) => `build:${name}`).join(' ')}`;
  }

  packageJson.scripts = Object.keys(scripts)
    .sort()
    .reduce((newScripts: IUnknownParams, key: string): IUnknownParams => {
      newScripts[key] = scripts[key];
      return newScripts;
    }, {});

  task.output = OutputFormatter.info(
    `Updating ${OutputFormatter.accent('scripts')} section in ${OutputFormatter.accent('package.json')}...`
  );
  return writeJsonSync(join(title, 'package.json'), packageJson);
}
