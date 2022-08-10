import { IContext, ProjectType } from '@src/main';
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

export function selectProjectType(context: IContext): Listr {
  switch (context?.type) {
    case types.PLAIN: {
      return plainProject(context);
    }
    case types.ANGULAR: {
      return angularProject(context);
    }
    default: {
      const availableTypes = `\n - ${Object.values(types).join('\n - ')}`;
      throw new Error(red(`\nInvalid project type!\nAvailable types:${availableTypes}`));
    }
  }
}

export { plainProject } from './plain.project';
export { angularProject } from './angular.project';
