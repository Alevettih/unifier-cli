import { ApplicationType, IApplicationInfo, IContext } from '@src/main';
import * as minimist from 'minimist';
import { ParsedArgs } from 'minimist';

export function initArguments(argv: string[]): IContext {
  const parsedArgs: ParsedArgs & IContext = minimist(argv.slice(2)) as ParsedArgs & IContext;

  if (parsedArgs && parsedArgs._ && parsedArgs._[0]) {
    parsedArgs.title = parsedArgs._[0];
  }

  parsedArgs.skipGit = parsedArgs['skip-git'] ?? false;
  parsedArgs.applicationsInfo = [];

  delete parsedArgs['skip-git'];
  delete parsedArgs._;

  Object.defineProperty(parsedArgs, 'applications', {
    get() {
      return parsedArgs.applicationsInfo.map(({ name }: IApplicationInfo): ApplicationType => name);
    },
    set(applications: ApplicationType[]): void {
      if (Array.isArray(applications)) {
        parsedArgs.applicationsInfo = applications.map(
          (name: ApplicationType, index: number): IApplicationInfo => ({
            port: parsedArgs.port + index,
            token: `token.${name}.json`,
            name
          })
        );
      }
    }
  });

  return parsedArgs as unknown as IContext;
}
