import { IQuestion } from '@utils/questions/index';
import { ListrTask, ListrTaskWrapper } from 'listr2';
import { ApplicationType, IContext } from '@src/main';
import { cyan } from 'ansi-colors';
import { minLength } from '@utils/validators';

export class ApplicationQuestion implements IQuestion {
  get tasks(): ListrTask[] {
    return [
      {
        enabled: this._shouldEnableTask,
        task: async (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          ctx.applications = await this._ask(task);
        }
      },
      {
        enabled: this._shouldEnableTask,
        task: async (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          task.title = `${this._title} ${cyan(ctx.applications.join(', '))}`;
        }
      }
    ];
  }

  private _shouldEnableTask({ type }: IContext): boolean {
    return type === 'angular';
  }

  private get _title(): string {
    return 'What application(s) do you want to create:';
  }

  private get _choices(): ApplicationType[] {
    return ['client', 'admin'];
  }

  private async _ask(task: ListrTaskWrapper<IContext, any>): Promise<ApplicationType[]> {
    return await task.prompt<ApplicationType[]>({
      type: 'multiselect',
      message: this._title,
      choices: this._choices,
      validate: minLength(1)
    });
  }
}
