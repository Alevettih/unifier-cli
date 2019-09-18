import 'module-alias/register';
import * as inquirer from 'inquirer';
import { questions } from '@utils/questions';
import { isDirectoryExistsAndNotEmpty } from '@utils/helpers';
import { remove } from 'fs-extra';
import { join } from 'path';
import * as minimist from 'minimist';
import { ParsedArgs } from 'minimist';
import { red } from 'colors/safe';
import * as Listr from 'listr';
import { selectProjectType } from '@src/project-types';
import { ListrOptions } from 'listr';
import { title } from '@utils/validators';

export type ProjectType = 'email' | 'plain-js' | 'angular' | 'react' | 'vue';

export interface Answer {
  title: string;
  description: string;
  type: ProjectType;
}

export const args: ParsedArgs = minimist(process.argv.slice(2));

export default (): Promise<void> => {
  if (args && args._ && args._[0]) {
    args.title = args._[0];
  }

  delete args._;

  const titleValidationResult: boolean | string = title(args.title);
  const isTitleAvailableAndValid: boolean = args.title && typeof titleValidationResult !== 'boolean';

  if (isTitleAvailableAndValid) {
    args.title = null;
    console.error(red(`>> ${titleValidationResult}`));
  }

  return inquirer
    .prompt(questions)
    .then(
      (answers: Answer): Promise<void> => {
        answers = Object.assign(answers, args);

        if (!answers.title) {
          throw new Error(red('Title is required!'));
        }

        const task = new Listr(
          [
            {
              title: 'Erase existing project directory',
              enabled: () => isDirectoryExistsAndNotEmpty(answers.title),
              task: () => remove(join(answers.title))
            },
            {
              title: 'Generate Project',
              task: () => selectProjectType(answers)
            }
          ],
          { collapse: false } as ListrOptions
        );

        return task.run().catch(error => {
          throw new Error(`Project creation failed: ${error}`);
        });
      }
    )
    .catch(e => e);
};
