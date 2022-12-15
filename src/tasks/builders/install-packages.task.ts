import { Listr } from 'listr2';
import { Observable } from 'rxjs';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { commandWithOutput } from '@helpers/command-with-output.helper';
import { shouldUseYarn } from '@helpers/verifications/should-use-yarn.helper';

export function installPackagesTask(): Listr {
  return new Listr([
    {
      title: `Install packages by ${OutputFormatter.accent('yarn')}`,
      enabled: shouldUseYarn,
      task: ({ childProcessOptions }): Observable<string> => commandWithOutput('yarn install', childProcessOptions)
    },
    {
      title: `Install packages by ${OutputFormatter.accent('npm')}`,
      enabled: (ctx: IAppContext) => !shouldUseYarn(ctx),
      task: ({ childProcessOptions }: IAppContext): Observable<string> =>
        commandWithOutput('npm i', childProcessOptions)
    }
  ]);
}
