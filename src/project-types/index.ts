import { Answer, ProjectType } from '@src/main';
import { red } from 'colors/safe';
import * as Listr from 'listr';

interface Types {
  [key: string]: ProjectType;
}

export const types: Types = {
  EMAIL: 'email',
  PLAIN: 'plain-js',
  ANGULAR: 'angular'
};

export { emailProject } from './email.project';
export { plainProject } from './plain.project';
export { angularProject } from './angular.project';

export function selectProjectType(answers: Answer): Listr {
  switch (answers && answers.type) {
    case types.EMAIL: {
      return this.emailProject(answers);
    }
    case types.PLAIN: {
      return this.plainProject(answers);
    }
    case types.ANGULAR: {
      return this.angularProject(answers);
    }
    default: {
      const availableTypes = `\n - ${Object.values(types).join('\n - ')}`;
      throw new Error(red(`\nInvalid project type!\nAvailable types:${availableTypes}`));
    }
  }
}
