import { Answer, ProjectType } from '@src/main';
import { red } from 'colors/safe';
import * as Listr from 'listr';

interface Types {
  [key: string]: ProjectType;
}

export const types: Types = {
  EMAIL: 'email',
  PLAIN: 'plain-js',
  ANGULAR: 'angular',
  REACT: 'react',
  VUE: 'vue'
};

export { emailProject } from './email.project';
export { plainProject } from './plain.project';
export { angularProject } from './angular.project';
export { reactProject } from './react.project';
export { vueProject } from './vue.project';

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
    case types.REACT: {
      return this.reactProject(answers);
    }
    case types.VUE: {
      return this.vueProject(answers);
    }
    default: {
      const availableTypes = `\n - ${Object.values(types).join('\n - ')}`;
      throw new Error(red(`\nInvalid project type!\nAvailable types:${availableTypes}`));
    }
  }
}
