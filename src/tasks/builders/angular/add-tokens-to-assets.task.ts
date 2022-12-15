import { join } from 'path';
import { command } from 'execa';
import { outputFileSync } from 'fs-extra';
import { ListrTaskWrapper } from 'listr2';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';

export async function addTokensToAssetsTask(
  { title, applicationsInfo, childProcessOptions }: IAppContext,
  task: ListrTaskWrapper<IAppContext, any>
): Promise<void> {
  task.output = OutputFormatter.info(`Generate token files...`);
  for (const { token } of applicationsInfo) {
    outputFileSync(join(title, `src/assets/${token}`), '{}', 'utf-8');
  }

  task.output = OutputFormatter.info(`Encode token files...`);
  await command(`npm run config:encode`, childProcessOptions);
}
