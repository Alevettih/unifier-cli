import { command, ExecaReturnValue } from 'execa';
import { IAppContext } from '@interface/app-context.interface';

export async function initializeGitTask({ childProcessOptions }: IAppContext): Promise<ExecaReturnValue> {
  return command('git init', Object.assign({ shell: true }, childProcessOptions));
}
