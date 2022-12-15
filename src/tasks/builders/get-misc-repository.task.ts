import { ListrTaskWrapper } from 'listr2';
import { command, ExecaReturnValue } from 'execa';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';

export function getMiscRepositoryTask(
  { directories: { base } }: IAppContext,
  task: ListrTaskWrapper<IAppContext, any>
): Promise<ExecaReturnValue> {
  task.output = OutputFormatter.info('Fetching tools configs & templates for dynamic file generation...');
  return command(`git clone https://github.com/requestum-team/unifier-misc.git ${base.misc}`);
}
