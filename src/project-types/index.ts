import { ProjectType } from '@src/main';

interface Types {
  [key: string]: ProjectType;
}

export const types: Types = {
  PLAIN: 'plain-js',
  ANGULAR: 'angular',
  REACT: 'react',
  VUE: 'vue'
};

export { plainProject } from './plain.project';
export { angularProject } from './angular.project';
export { reactProject } from './react.project';
export { vueProject } from './vue.project';
