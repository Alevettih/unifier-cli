import { compile } from 'handlebars';
import { ListrTaskWrapper } from 'listr2';
import { outputFileSync, readFileSync } from 'fs-extra';
import { IPaths } from '@interface/paths.interface';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { getFilenameFromPath } from '@helpers/getters/get-filename-from-path.helper';

export function applyTemplatesTask(paths: IPaths[], context: any, task: ListrTaskWrapper<IAppContext, any>): void {
  for (const { src, dist } of paths) {
    const template: string = readFileSync(src)?.toString();
    const content: HandlebarsTemplateDelegate = compile(template);

    task.output = OutputFormatter.info(`Apply ${OutputFormatter.accent(getFilenameFromPath(src))} file template`);

    outputFileSync(dist, content(context));
  }
}
