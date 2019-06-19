import { ProjectType } from '@src/main';

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
