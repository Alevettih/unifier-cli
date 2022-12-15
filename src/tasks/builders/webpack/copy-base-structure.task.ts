import { join } from 'path';
import { copySync } from 'fs-extra';
import { ListrTaskWrapper } from 'listr2';
import { ProjectType } from '@enum/project-type.enum';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { applyTemplatesTask } from '@tasks/builders/apply-templates.task';

export function copyBaseStructureTask(
  { title, type, directories: { webpack } }: IAppContext,
  task: ListrTaskWrapper<IAppContext, any>
): void {
  task.output = OutputFormatter.info('Apply templates...');
  applyTemplatesTask(
    [
      { src: join(webpack.templates, 'package.json.hbs'), dist: join(title, 'package.json') },
      { src: join(webpack.templates, 'webpack.config.js.hbs'), dist: join(title, 'webpack.config.js') }
    ],
    { title, [type]: true },
    task
  );

  task.output = OutputFormatter.info('Copy misc files...');
  copySync(join(webpack.files, 'general', 'helpers'), join(title, 'misc', 'helpers'));

  if (type === ProjectType.EMAIL) {
    copySync(join(webpack.files, 'general', 'plugins'), join(title, 'misc', 'plugins'));
  }

  task.output = OutputFormatter.info('Copy codebase files...');
  copySync(join(webpack.files, type, 'src'), join(title, 'src'));
}
