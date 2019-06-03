import 'module-alias/register';
import * as inquirer from 'inquirer';
import * as projects from '@src/project-types';
import { questions } from '@utils/questions';

export type ProjectType = 'plain-js' | 'angular' | 'react' | 'vue';

export interface Answer {
  title: string,
  description: string,
  type: ProjectType
}

export default (): Promise<void | TypeError> => {
  return inquirer.prompt(questions).then((answers: Answer): void | TypeError => {
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
