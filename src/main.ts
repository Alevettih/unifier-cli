import 'module-alias/register';
import * as inquirer from 'inquirer';
import * as projects from '@src/project-types';
import { questions } from '@utils/questions';
import { isDirectoryExistsAndNotEmpty } from "@utils/helpers";
import { removeSync } from "fs-extra";
import { join } from "path";

export type ProjectType = 'plain-js' | 'angular' | 'react' | 'vue';

export interface Answer {
  title: string,
  description: string,
  type: ProjectType
}

export default (): Promise<void | TypeError> => {
  return inquirer.prompt(questions).then((answers: Answer): void | TypeError => {
    if (!answers.title) {
      throw new Error('Title is required!')
    }

    if (isDirectoryExistsAndNotEmpty(answers.title)) {
      console.log(`Erasing directory "${join(answers.title)}"...`);
      removeSync( join(answers.title) );
      console.log(`Directory "${join(answers.title)}" has been erase!`);
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
        return TypeError('Invalid project type!');
      }
    }
  })
};
