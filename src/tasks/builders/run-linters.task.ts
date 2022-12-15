import { catchError, Observable } from 'rxjs';
import { Listr, ListrTask, ListrTaskWrapper } from 'listr2';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { commandWithOutput } from '@helpers/command-with-output.helper';

export function runLintersTask({ lintersKeys, childProcessOptions }: IAppContext): Listr {
  const message: string = OutputFormatter.danger('Linting failed, please fix linting problems manually');

  return new Listr(
    lintersKeys.map(
      (linter: string): ListrTask => ({
        title: `Run ${OutputFormatter.accent(linter)}`,
        task: (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>): Observable<string> =>
          commandWithOutput(`npm run ${linter}`, childProcessOptions).pipe(
            catchError(() => {
              task.output = message;
              throw new Error(message);
            })
          ),
        options: { persistentOutput: true }
      })
    )
  );
}
