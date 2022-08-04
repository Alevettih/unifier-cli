import config from '@specifier/configs/plain-js.config';
import { Specifier } from '@specifier/index';
import { Listr, ListrTaskWrapper } from 'listr2';
import { cyan } from 'ansi-colors';
import { removeSync } from 'fs-extra';
import { join } from 'path';
import { IContext } from '@src/main';

export class PlainJSSpecifier extends Specifier {
  specify(): Listr {
    return new Listr([
      {
        title: 'Git',
        task: () =>
          new Listr([
            { title: 'Remove default', task: ({ title }: IContext): void => removeSync(join(title, '.git')) },
            { title: 'Init new repository', task: () => this.initGit() }
          ])
      },
      {
        title: 'Do some magic...',
        task: () =>
          new Listr(
            [
              {
                title: 'Copy configs...',
                task: ({ title }: IContext): Listr => this.copyConfigs(...config.getConfigsPaths(title))
              },
              {
                title: `Update ${cyan('.gitignore')} rules`,
                task: (ctx: IContext): Promise<void> => this.updateGitignoreRules(ctx)
              },
              {
                title: 'Install dependencies',
                task: (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
                  task.title = `Install dependencies by ${cyan(ctx.packageManager)}`;
                  return this.installPackages();
                }
              }
            ],
            { concurrent: true }
          )
      },
      {
        title: 'Run Prettier',
        task: () => this.runPrettier()
      },
      {
        title: 'Linters',
        task: () => this.lintersTask()
      },
      {
        title: 'Do initial commit',
        task: () => this.initialCommit()
      }
    ]);
  }
}
