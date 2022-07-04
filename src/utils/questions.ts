import { getCWD } from '@utils/helpers';
import { title } from '@utils/validators';
import { isDirectoryExistsAndNotEmpty } from '@utils/helpers';
import { types } from '@src/project-types';
import { args } from '@src/main';
import { grey, yellow } from 'colors/safe';
import { major, satisfies } from 'semver';

export const questions = angularInfo => [
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
      { name: 'Angular', value: types.ANGULAR }
    ]
  },
  {
    name: 'version',
    type: 'list',
    message: 'version:',
    when(answers) {
      const { ['dist-tags']: distTags, versions } = angularInfo;
      if (answers.type !== types.ANGULAR) {
        return false;
      }

      if (!args.version) {
        return true;
      } else {
        const isVersionAvailable = Boolean(distTags[args.version] || versions.includes(args.version));
        if (isVersionAvailable) {
          answers.version = distTags[args.version] || args.version;
        }
        return !isVersionAvailable;
      }
    },
    choices() {
      const { ['dist-tags']: distTags } = angularInfo;
      return Object.entries(distTags)
        .filter(([, value]: [string, string]): boolean => satisfies(value, `>=${major(distTags.latest) - 1}.x`))
        .map(([name, value]: [string, string]) => ({ name: `${name}: ${grey(value)}`, value }));
    }
  }
];
