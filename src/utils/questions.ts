import { getCWD } from '@utils/helpers';
import { title } from '@utils/validators';
import { isDirectoryExistsAndNotEmpty } from '@utils/helpers';
import { types } from '@src/project-types';
import { cyan, grey, yellow } from 'ansi-colors';
import { major, satisfies } from 'semver';
import { Listr, ListrContext, ListrTaskWrapper } from 'listr2';
import { IContext, PackageManager } from '@src/main';

export const questions = () => {
  return new Listr(
    [
      {
        enabled: (ctx: any): boolean => !ctx.title,
        task: async (ctx: ListrContext, task: ListrTaskWrapper<ListrContext, any>) => {
          ctx.title = await task.prompt<string>({
            type: 'input',
            message: 'Project name:',
            initial: getCWD(),
            validate: title
          });
        }
      },
      {
        enabled: (ctx: any) => isDirectoryExistsAndNotEmpty(ctx.title),
        task: async (ctx: ListrContext, task: ListrTaskWrapper<ListrContext, any>) => {
          ctx.title = await task.prompt<string>({
            type: 'input',
            prefix:
              yellow('  Directory with that name is already exists and contain files.\n') +
              yellow('  Change the name or proceed with that value for erasing the directory.\n') +
              cyan('?'),
            message: 'Project name:',
            initial: ctx.title
          });
        }
      },
      {
        enabled: (ctx: any) => !ctx.type || !Object.values(types).includes(ctx.type),
        task: async (ctx: ListrContext, task: ListrTaskWrapper<ListrContext, any>) => {
          ctx.type = await task.prompt<string>({
            type: 'select',
            message: 'Project type:',
            prefix:
              ctx.type && !Object.values(types).includes(ctx.type)
                ? yellow('  Invalid project type!\n  Please choose correct type from list.\n') + cyan('?')
                : null,
            choices: Object.values(types)
          });
        }
      },
      {
        enabled: (ctx: any) => {
          const { ['dist-tags']: distTags, versions } = ctx.angularInfo;
          if (ctx.type !== types.ANGULAR) {
            return false;
          }

          if (!ctx.version) {
            return true;
          } else {
            const isVersionAvailable = Boolean(distTags[ctx.version] || versions.includes(ctx.version));
            if (isVersionAvailable) {
              ctx.version = distTags[ctx.version] || ctx.version;
            }
            return !isVersionAvailable;
          }
        },
        task: async (ctx: ListrContext, task: ListrTaskWrapper<ListrContext, any>) => {
          ctx.version = await task.prompt<string>({
            type: 'select',
            message: 'Version:',
            choices() {
              const { ['dist-tags']: distTags } = ctx.angularInfo;
              return Object.entries(distTags)
                .filter(([, value]: [string, string]): boolean => satisfies(value, `>=${major(distTags.latest) - 1}.x`))
                .map(([name, value]: [string, string]) => ({ message: `${name}: ${grey(value)}`, name: value, value }));
            }
          });
        }
      },
      {
        enabled: ({ isYarnAvailable }: IContext) => isYarnAvailable,
        task: async (ctx: ListrContext, task: ListrTaskWrapper<ListrContext, any>) => {
          ctx.packageManager = await task.prompt<string>({
            type: 'select',
            message: 'Preferred package manager:',
            choices: ['npm', 'yarn'] as PackageManager[]
          });
        }
      }
    ],
    { concurrent: false }
  );
};
