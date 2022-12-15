import { join } from 'path';
import * as deepMerge from 'deepmerge';
import { ListrTaskWrapper } from 'listr2';
import { outputFileSync, readFileSync } from 'fs-extra';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { newlineSeparatedValue } from '@helpers/newline-separated-value.helper';
import { arrayMerge } from '@helpers/data-structure-manipulation/array-merge.helper';

export function updateGitignoreRulesTask(
  { title, directories: { base } }: IAppContext,
  task: ListrTaskWrapper<IAppContext, any>
): void {
  task.output = OutputFormatter.info(`Getting ${OutputFormatter.accent('.gitignore')} file...`);
  const projectGitignore: object = newlineSeparatedValue.parse(readFileSync(join(title, '.gitignore'), 'utf-8'));
  task.output = OutputFormatter.info(`Updating ${OutputFormatter.accent('.gitignore')} file...`);
  const specificationGitignore: object = newlineSeparatedValue.parse(
    readFileSync(join(base.configs, '.gitignore'), 'utf-8')
  );

  outputFileSync(
    join(title, '.gitignore'),
    newlineSeparatedValue.stringify(deepMerge(projectGitignore, specificationGitignore, { arrayMerge })),
    'utf-8'
  );
}
