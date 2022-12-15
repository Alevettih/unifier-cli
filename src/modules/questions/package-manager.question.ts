import { AbstractQuestion } from '@src/misc/abstracts/question.abstract';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { IAppContext } from '@interface/app-context.interface';
import { PackageManager } from '@type/package-manager.type';
import { ListrTask, ListrTaskWrapper } from 'listr2';

export class PackageManagerQuestion extends AbstractQuestion<PackageManager> {
  get tasks(): ListrTask[] {
    return [
      {
        enabled: this._shouldEnableTask,
        task: async (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>) => {
          ctx.packageManager = await this._ask(task);
        }
      },
      {
        enabled: this._shouldEnableTask,
        task: async (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>) => {
          task.title = `${this._title} ${OutputFormatter.accent(ctx.packageManager)}`;
        }
      }
    ];
  }

  protected get _title(): string {
    return 'Preferred package manager:';
  }

  private get _choices(): PackageManager[] {
    return ['npm', 'yarn'];
  }

  protected async _ask(task: ListrTaskWrapper<IAppContext, any>): Promise<PackageManager> {
    return await task.prompt<PackageManager>({
      type: 'select',
      message: this._title,
      choices: this._choices
    });
  }

  private _shouldEnableTask({ isYarnAvailable }: IAppContext): boolean {
    return isYarnAvailable;
  }
}
