import { ListrTask, ListrTaskWrapper } from 'listr2';
import { types } from '@src/project-types';
import { IContext, ProjectType } from '@src/main';
import { cyan, yellow } from 'ansi-colors';
import { IQuestion } from '@utils/questions/index';

export class TypeQuestion implements IQuestion {
  get tasks(): ListrTask[] {
    return [
      {
        enabled: (ctx: any) => !ctx.type || !Object.values(types).includes(ctx.type),
        task: async (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          ctx.type = await this._ask(ctx, task);
        }
      },
      {
        task: async (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          task.title = `${this._title} ${cyan(ctx.type)}`;
        }
      }
    ];
  }

  private get _title(): string {
    return 'Project type:';
  }

  private get _prefix(): string {
    return yellow('  Invalid project type!\n  Please choose correct type from list.\n') + cyan('?');
  }

  private async _ask(ctx: IContext, task: ListrTaskWrapper<IContext, any>): Promise<ProjectType> {
    const shouldShowWarning: boolean = ctx.type && !Object.values(types).includes(ctx.type);

    return await task.prompt<ProjectType>({
      type: 'select',
      message: this._title,
      prefix: shouldShowWarning ? this._prefix : null,
      choices: Object.values(types)
    });
  }
}
