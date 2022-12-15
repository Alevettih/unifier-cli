import { command, ExecaReturnValue } from 'execa';
import { IAppContext } from '@interface/app-context.interface';

export function initialCommitTask(amend?: boolean): (ctx: IAppContext) => Promise<ExecaReturnValue> {
  return ({ childProcessOptions }: IAppContext): Promise<ExecaReturnValue> =>
    command(`git add .&& git commit -m "Initial commit" -n${amend ? ` --amend` : ''}`, childProcessOptions);
}
