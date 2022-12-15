import { join } from 'path';
import * as minimist from 'minimist';
import { IAppContext } from '@interface/app-context.interface';
import { ParsedArgs } from 'minimist';
import { IAppInfo } from '@interface/app-info.interface';
import { AppType } from '@type/app-type.type';
import { Options } from 'execa';
import { IProjectDirectories } from '@interface/directories.interface';

export function initArguments(argv: string[]): IAppContext {
  const parsedArgs: ParsedArgs & IAppContext = minimist(argv.slice(2)) as ParsedArgs & IAppContext;

  if (parsedArgs?._?.[0]) {
    parsedArgs.title = parsedArgs._[0];
  }

  parsedArgs.skipGit = parsedArgs['skip-git'] ?? false;
  parsedArgs.applicationsInfo = [];

  delete parsedArgs['skip-git'];
  delete parsedArgs._;

  Object.defineProperty(parsedArgs, 'applications', {
    get: () => parsedArgs.applicationsInfo.map(({ name }: IAppInfo): AppType => name),
    set(applications: AppType[]): void {
      if (Array.isArray(applications)) {
        parsedArgs.applicationsInfo = applications.map(
          (name: AppType, index: number): IAppInfo => ({
            port: parsedArgs.port + index,
            token: `token.${name}.json`,
            name
          })
        );
      }
    }
  });

  Object.defineProperty(parsedArgs, 'childProcessOptions', {
    get: () => ({ shell: true, cwd: parsedArgs.title } as Options)
  });

  Object.defineProperty(parsedArgs, 'ngCommand', {
    get: () => `npx --package @angular/cli${parsedArgs.version ? `@${parsedArgs.version}` : ''} ng`
  });

  Object.defineProperty(parsedArgs, 'directories', {
    get() {
      const tmp: string = join(__dirname, 'tmp');
      const misc: string = join(tmp, 'misc');
      const files: string = join(misc, 'files');
      const templates: string = join(misc, 'templates');
      const codebase: string = join(tmp, 'codebase');
      const configs: string = join(files, 'configs');

      return {
        base: { tmp, misc, files, templates, codebase, configs },
        webpack: {
          templates: join(templates, 'webpack'),
          files: join(files, 'webpack')
        },
        angular: {
          templates: join(templates, 'angular'),
          configs: join(configs, 'angular')
        }
      } as IProjectDirectories;
    }
  });

  return parsedArgs as unknown as IAppContext;
}
