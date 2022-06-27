import { getCWD } from '@utils/helpers';
import { title } from '@utils/validators';
import { isDirectoryExistsAndNotEmpty } from '@utils/helpers';
import { types } from '@src/project-types';
import { Questions } from 'inquirer';
import { args } from '@src/main';
import { grey, yellow } from 'colors/safe';
import { command } from 'execa';
import { major, satisfies } from 'semver';

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
      yellow('  Directory with that name is already exists and contain files.\n') +
      yellow('  Change the name or proceed with that value for erasing the directory.\n '),
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
      { name: 'Email Template', value: types.EMAIL },
      { name: 'Angular', value: types.ANGULAR }
    ]
  },
  {
    name: 'version',
    type: 'list',
    message: 'version:',
    when(answers) {
      if (args.type === types.ANGULAR && !args.version) {
        return true;
      } else {
        answers.version = args.version;
        return false;
      }
    },
    choices: async () => {
      const commandRes = await command(`npm view @angular/cli --json`, this.childProcessOptions);
      const angularInfo = JSON.parse(commandRes.stdout);
      const distTags = angularInfo['dist-tags'];

      return Object.entries(distTags)
        .filter(([, value]: [string, string]): boolean => satisfies(value, `>=${major(distTags.latest) - 1}.x`))
        .map(([name, value]: [string, string]) => ({
          name: `${name.replace(/^v\d{1,2}-(lts)$/gi, '$1')}: ${grey(value)}`,
          value
        }));
    }
  }
];
