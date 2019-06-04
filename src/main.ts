import 'module-alias/register';
import * as inquirer from 'inquirer';
import * as projects from '@src/project-types';
import { questions } from '@utils/questions';
import { isDirectoryExistsAndNotEmpty } from '@utils/helpers';
import { removeSync } from 'fs-extra';
import { join } from 'path';
import * as minimist from 'minimist';
import { ParsedArgs } from 'minimist';

export type ProjectType = 'plain-js' | 'angular' | 'react' | 'vue';

export interface Answer {
  title: string;
  description: string;
  type: ProjectType;
}

export const args: ParsedArgs = minimist(process.argv.slice(2));

export default (): Promise<void | TypeError> => {
  if (args._[0]) {
    args.title = args._[0];
  }

  delete args._;

  return inquirer.prompt(questions).then((answers: Answer): void | TypeError => {
    answers = Object.assign(answers, args);

    if (!answers.title) {
      throw new Error('Title is required!');
    }

    if (isDirectoryExistsAndNotEmpty(answers.title)) {
      console.log(`Erasing directory "${join(answers.title)}"...`);
      removeSync( join(answers.title) );
      console.log(`Directory "${join(answers.title)}" has been erased!`);
    }

    switch (answers && answers.type) {
      case projects.types.PLAIN: {
        return projects.plainProject(answers);
      }
      case projects.types.ANGULAR: {
        return projects.angularProject(answers);
      }
      case projects.types.REACT: {
        return projects.reactProject(answers);
      }
      case projects.types.VUE: {
        return projects.vueProject(answers);
      }
      default: {
        const types = `\n - ${Object.values(projects.types).join('\n - ')}`;
        throw new TypeError(`Invalid project type!\nAvailable types:${types} \n`);
      }
    }
  });
};
