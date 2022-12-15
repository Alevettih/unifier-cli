import { join } from 'path';
import { major } from 'semver';
import { readJsonSync } from 'fs-extra';
import { Listr, ListrTask, ListrTaskWrapper } from 'listr2';
import { command, ExecaReturnValue } from 'execa';
import { IAppContext } from '@interface/app-context.interface';
import { IPackageJson, IUnknownParams } from '@interface/package-json.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { mergeWithJsonTask } from '@tasks/builders/merge-with-json.task';

export function updateDependenciesTask(
  { skipGit, title, version, codebaseInfo, directories: { base } }: IAppContext,
  task: ListrTaskWrapper<IAppContext, any>
): Listr | void {
  task.output = OutputFormatter.info(`Getting ${OutputFormatter.accent('package.json')} files...`);
  const codebasePackageJson: IPackageJson = readJsonSync(join(base.codebase, 'package.json'));
  const packageJson: IPackageJson = readJsonSync(join(title, 'package.json'));

  task.output = OutputFormatter.info(`Generating a list of additional dependencies...`);
  const dependencies: IUnknownParams = JSON.parse(JSON.stringify(codebasePackageJson.dependencies));
  const devDependencies: IUnknownParams = JSON.parse(JSON.stringify(codebasePackageJson.devDependencies));

  for (const key in { ...dependencies, ...devDependencies }) {
    if (key.includes('@angular')) {
      delete dependencies[key];
      delete devDependencies[key];
    }

    if (packageJson.dependencies.hasOwnProperty(key)) {
      delete dependencies[key];
    }
    if (packageJson.devDependencies.hasOwnProperty(key) || (skipGit && ['pretty-quick', 'husky'].includes(key))) {
      delete devDependencies[key];
    }
  }

  if (major(version) !== codebaseInfo.version) {
    const allDependenciesNames: string[] = Object.keys({ ...dependencies, ...devDependencies });
    return new Listr(
      allDependenciesNames.map((key: string, index: number): ListrTask => {
        return {
          task: async (): Promise<void> => {
            task.output = OutputFormatter.info(
              'There is no data on the optimal versions of codebase dependencies for the selected version of Angular.',
              `Fetch available version for:`,
              `[${index + 1}/${allDependenciesNames.length}] ${OutputFormatter.accent(key)}`
            );
            const { stdout }: ExecaReturnValue = await command(`npm show ${key} version`);
            const lastPackageVersion: string = stdout ? `^${stdout}` : '';

            if (dependencies.hasOwnProperty(key)) {
              dependencies[key] = lastPackageVersion;
            }

            if (devDependencies.hasOwnProperty(key)) {
              devDependencies[key] = lastPackageVersion;
            }

            return writingChanges({ dependencies, devDependencies });
          }
        };
      })
    );
  }

  return writingChanges({ dependencies, devDependencies });

  function writingChanges(mergedObj: Partial<IPackageJson>): void {
    task.output = OutputFormatter.info(
      `Updating ${OutputFormatter.accent('dependencies')} and ${OutputFormatter.accent(
        'devDependencies'
      )} sections in ${OutputFormatter.accent('package.json')}`
    );

    return mergeWithJsonTask<IPackageJson>(join(title, 'package.json'), mergedObj);
  }
}
