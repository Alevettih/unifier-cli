import { IAnswer, ProjectType } from '@src/main';
import { red } from 'ansi-colors';
import { Listr } from 'listr2';
import { plainProject } from './plain.project';
import { angularProject } from './angular.project';

interface ITypes {
  [key: string]: ProjectType;
}

export const types: ITypes = {
  PLAIN: 'plain-js',
  ANGULAR: 'angular'
};

export function selectProjectType(answers: IAnswer): Listr {
  switch (answers && answers.type) {
    case types.PLAIN: {
      return plainProject(answers);
    }
    case types.ANGULAR: {
      return angularProject(answers);
    }
    default: {
      const availableTypes = `\n - ${Object.values(types).join('\n - ')}`;
      throw new Error(red(`\nInvalid project type!\nAvailable types:${availableTypes}`));
    }
  }
}

export { plainProject } from './plain.project';
export { angularProject } from './angular.project';
