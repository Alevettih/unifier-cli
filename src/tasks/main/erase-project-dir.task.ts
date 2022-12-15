import { join } from 'path';
import { remove } from 'fs-extra';
import { ListrTaskWrapper } from 'listr2';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';

export function eraseProjectDirTask({ title }: IAppContext, task: ListrTaskWrapper<IAppContext, any>): Promise<void> {
  task.output = OutputFormatter.info(`Removing the existing directory ${OutputFormatter.accent(join(title))}`);
  return remove(join(title));
}
