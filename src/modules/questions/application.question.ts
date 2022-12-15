import { AbstractQuestion } from '@abstracts/question.abstract';
import { IAppContext } from '@interface/app-context.interface';
import { AppType } from '@type/app-type.type';
import { ListrTask, ListrTaskWrapper } from 'listr2';
import { Validators } from '@misc/validators';
import { OutputFormatter } from '@helpers/output-formatter.helper';

export class ApplicationQuestion extends AbstractQuestion<AppType[]> {
  get tasks(): ListrTask[] {
    return [
      {
        enabled: this._shouldEnableTask,
        task: async (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>) => {
          ctx.applications = await this._ask(task);
        }
      },
      {
        enabled: this._shouldEnableTask,
        task: async (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>) => {
          task.title = `${this._title} ${OutputFormatter.accent(ctx.applications.join(', '))}`;
        }
      }
    ];
  }

  protected get _title(): string {
    return 'What application(s) do you want to create:';
  }

  private get _choices(): AppType[] {
    return ['client', 'admin'];
  }

  protected async _ask(task: ListrTaskWrapper<IAppContext, any>): Promise<AppType[]> {
    return await task.prompt<AppType[]>({
      type: 'multiselect',
      message: this._title,
      choices: this._choices,
      validate: Validators.minLength(1)
    });
  }

  private _shouldEnableTask({ type }: IAppContext): boolean {
    return type === 'angular';
  }
}
