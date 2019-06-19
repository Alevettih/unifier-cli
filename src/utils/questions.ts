import { getCWD } from '@utils/helpers';
import { title } from '@utils/validators';
import { isDirectoryExistsAndNotEmpty } from '@utils/helpers';
import { types } from '@src/project-types';
import { Questions } from 'inquirer';
import { args } from '@src/main';
import { yellow } from 'colors/safe';

export const questions: Questions = [
  {
    name: 'title',
    type: 'input',
    message: 'Project name:',
    default: getCWD(),
    validate: title,
    when(answers) {
      if (!args.title) {
        return true;
      } else {
        answers.title = args.title;
        return false;
      }
    }
  },
  {
    type: 'input',
    name: 'title',
    prefix:
      yellow('Directory with that name is already exists and contain files.\n') +
      yellow('Change the name or proceed with that value for erasing the directory.\n '),
    message: 'Project name:',
    default: answers => answers.title,
    when: answers => isDirectoryExistsAndNotEmpty(answers.title)
  },
  {
    name: 'type',
    type: 'list',
    message: 'Project type:',
    when(answers) {
      if (!args.type) {
        return true;
      } else {
        answers.type = args.type;
        return false;
      }
    },
    choices: [
      { name: 'Plain JS', value: types.PLAIN },
      { name: 'Angular', value: types.ANGULAR },
      { name: 'React', value: types.REACT },
      { name: 'Vue', value: types.VUE }
    ]
  }
];
