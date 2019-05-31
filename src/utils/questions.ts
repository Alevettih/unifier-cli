import { getCWD } from '@utils/helpers';
import { title } from '@utils/validators';
import { types } from '@src/project-types';
import { Questions } from "inquirer";

export const questions: Questions = [{
  name: 'title',
  type: 'input',
  message: 'Project name:',
  default: getCWD(),
  validate: title
}, {
  name: 'description',
  type: 'input',
  message: 'Project description:',
  default: ''
}, {
  name: 'type',
  type: 'list',
  message: 'Project type:',
  choices: [
    {name: 'Plain JS', value: types.PLAIN},
    {name: 'Angular', value: types.ANGULAR},
    {name: 'React', value: types.REACT},
    {name: 'Vue', value: types.VUE}
  ]
}];
