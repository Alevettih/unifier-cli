import { Questions } from '@utils/questions';
import { getAngularInfo, initArguments, isDirectoryExistsAndNotEmpty, isYarnAvailable } from '@utils/helpers';
import { remove } from 'fs-extra';
import { join } from 'path';
import { green, red } from 'ansi-colors';
import { Listr } from 'listr2';
import { selectProjectType } from '@src/project-types';
import { title } from '@utils/validators';
import getPort from 'get-port';

export type ProjectType = 'plain-js' | 'angular';
export type PackageManager = 'npm' | 'yarn';
export type ApplicationType = 'admin' | 'client';

export interface IAngularInfo {
  versions: string[];
  tags: { [key: string]: string };
}

export interface IApplicationInfo {
  name: ApplicationType;
  token: `token.${ApplicationType}.json`;
  port: number;
}

export interface IContext {
  port: number;
  isYarnAvailable: boolean;
  title: string;
  version: string;
  type: ProjectType;
  packageManager: PackageManager;
  applicationsInfo: IApplicationInfo[];
  applications: ApplicationType[];
  angularInfo: IAngularInfo;
  lintersKeys: string[];
  skipGit: boolean;
}

export const args: IContext = initArguments(process.argv);

export default async function main(): Promise<void | IContext> {
  const titleValidationResult: boolean | string = title(args.title);
  const isTitleAvailableAndValid: boolean = args.title && typeof titleValidationResult !== 'boolean';

  if (isTitleAvailableAndValid) {
    args.title = null;
    console.error(red(`>> ${titleValidationResult}`));
  }

  const task = new Listr(
    [
      {
        title: 'Checking dependencies data',
        task: async (ctx: IContext) => {
          ctx.isYarnAvailable = await isYarnAvailable();
          ctx.angularInfo = await getAngularInfo();
          ctx.port = await getPort();
          ctx.packageManager = 'npm';
        }
      },
      {
        skip: () => process.env.NODE_ENV === 'test',
        title: 'Answer some questions',
        task: () => new Questions().ask()
      },
      {
        title: 'Erase existing project directory',
        enabled: ({ title }: IContext): boolean => isDirectoryExistsAndNotEmpty(title),
        task: ({ title }: IContext): Promise<void> => remove(join(title))
      },
      {
        title: 'Generate Project',
        task: selectProjectType
      }
    ],
    {
      ctx: args,
      rendererOptions: {
        showErrorMessage: false,
        collapseErrors: false,
        collapse: false
      }
    }
  );

  return task.run().catch(error => {
    if (error) {
      console.log();
      console.log('Project creation failed: ');
      if (typeof error.exitCode === 'number') {
        console.log(
          'Error: ',
          red(`Command failed with exit code ${error.exitCode} ${error.exitCodeName ? `(${error.exitCodeName})` : ''}`)
        );
      }

      if (error.command) {
        console.log('Command: ', green(error.command));
      }

      if (error.stderr) {
        console.log('Error log: ');
        console.log(red(error.stderr));
      }

      if (!error.command || !error.exitCode || !error.stderr) {
        console.log('Plain error: ');
        console.dir(error);
      }
      throw new Error(`Project creation failed: ${error}`);
    }
  });
}
