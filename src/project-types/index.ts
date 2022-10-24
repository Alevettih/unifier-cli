import { IContext } from '@src/main';
import { red } from 'ansi-colors';
import { Listr } from 'listr2';
import { markupProject } from './markup.project';
import { angularProject } from './angular.project';
import { emailProject } from '@src/project-types/email.project';

export enum ProjectType {
  EMAIL = 'email',
  MARKUP = 'markup',
  ANGULAR = 'angular'
}

export function selectProjectType(context: IContext): Listr {
  switch (context?.type) {
    case ProjectType.EMAIL: {
      return emailProject(context);
    }
    case ProjectType.MARKUP: {
      return markupProject(context);
    }
    case ProjectType.ANGULAR: {
      return angularProject(context);
    }
    default: {
      const availableTypes = `\n - ${Object.values(ProjectType).join('\n - ')}`;
      throw new Error(red(`\nInvalid project type!\nAvailable types:${availableTypes}`));
    }
  }
}

export { markupProject } from './markup.project';
export { emailProject } from './email.project';
export { angularProject } from './angular.project';
