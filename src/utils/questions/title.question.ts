import { IContext } from '@src/main';
import { getCWD, isDirectoryExistsAndNotEmpty } from '@utils/helpers';
import { ListrTask, ListrTaskWrapper } from 'listr2';
import { cyan, yellow } from 'ansi-colors';
import { title } from '@utils/validators';
import { IQuestion } from '@utils/questions/index';

export class TitleQuestion implements IQuestion {
  get tasks(): ListrTask[] {
    return [
      {
        enabled: this._shouldAskTitle,
        task: async (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          if (!ctx.title) {
            ctx.title = await this._ask(ctx, task);
          }

          if (isDirectoryExistsAndNotEmpty(ctx.title)) {
            ctx.title = await this._ask(ctx, task);
          }
        }
      },
      {
        task: async (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          task.title = `${this._title} ${cyan(ctx.title)}`;
        }
      }
    ];
  }

  private get _title(): string {
    return 'Project name:';
  }

  private get _prefix(): string {
    return (
      yellow('  Directory with that name is already exists and contain files.\n') +
      yellow('  Change the name or proceed with that value for erasing the directory.\n') +
      cyan('?')
    );
  }

  private async _ask(ctx: IContext, task: ListrTaskWrapper<IContext, any>): Promise<string> {
    return task.prompt<string>({
      type: 'input',
      message: this._title,
      initial: ctx.title || getCWD(),
      prefix: isDirectoryExistsAndNotEmpty(ctx.title) ? this._prefix : null,
      validate: title
    });
  }

  private _shouldAskTitle({ title }: IContext): boolean {
    return !title || (title && isDirectoryExistsAndNotEmpty(title));
  }
}
