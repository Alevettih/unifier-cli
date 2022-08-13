import { IQuestion } from '@utils/questions/index';
import { ListrTask, ListrTaskWrapper } from 'listr2';
import { IContext, PackageManager } from '@src/main';
import { cyan } from 'ansi-colors';

export class PackageManagerQuestion implements IQuestion {
  get tasks(): ListrTask[] {
    return [
      {
        enabled: this._shouldEnableTask,
        task: async (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          ctx.packageManager = await this._ask(task);
        }
      },
      {
        enabled: this._shouldEnableTask,
        task: async (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          task.title = `${this._title} ${cyan(ctx.packageManager)}`;
        }
      }
    ];
  }

  private get _title(): string {
    return 'Preferred package manager:';
  }

  private get _choices(): PackageManager[] {
    return ['npm', 'yarn'];
  }

  private _shouldEnableTask({ isYarnAvailable }: IContext): boolean {
    return isYarnAvailable;
  }

  private async _ask(task: ListrTaskWrapper<IContext, any>): Promise<PackageManager> {
    return await task.prompt<PackageManager>({
      type: 'select',
      message: this._title,
      choices: this._choices
    });
  }
}
