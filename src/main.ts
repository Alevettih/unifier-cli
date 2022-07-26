import * as inquirer from 'inquirer';
import { questions } from '@utils/questions';
import { getAngularInfo, isDirectoryExistsAndNotEmpty } from '@utils/helpers';
import { remove } from 'fs-extra';
import { join } from 'path';
import * as minimist from 'minimist';
import { ParsedArgs } from 'minimist';
import { red, green } from 'colors/safe';
import { Listr } from 'listr2';
import { selectProjectType } from '@src/project-types';
import { title } from '@utils/validators';

export type ProjectType = 'email' | 'plain-js' | 'angular';

export interface IAnswer {
  title: string;
  description: string;
  type: ProjectType;
  version: string;
  'skip-git': boolean;
}

export const args: ParsedArgs = minimist(process.argv.slice(2));

export default async (): Promise<void> => {
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
  const angularInfo = await getAngularInfo();

  return inquirer
    .prompt(questions(angularInfo))
    .then((answers: IAnswer): Promise<void> => {
      answers = Object.assign(args, answers);

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
        {
          rendererOptions: {
            showErrorMessage: false,
            collapseErrors: false,
            collapse: false
          }
        }
      );

      return task.run().catch(error => {
        if (error) {
          console.log();
          console.log('Project creation failed: ');
          if (typeof error.exitCode === 'number') {
            console.log(
              'Error: ',
              red(
                `Command failed with exit code ${error.exitCode} ${error.exitCodeName ? `(${error.exitCodeName})` : ''}`
              )
            );
          }

          if (error.command) {
            console.log('Command: ', green(error.command));
          }

          if (error.stderr) {
            console.log('Error log: ');
            console.log(red(error.stderr));
          }

          if (!error.command || !error.exitCode || !error.stderr) {
            console.log('Plain error: ');
            console.dir(error);
          }
        }
        throw new Error(`Project creation failed: ${error}`);
      });
    })
    .catch(e => e);
};
