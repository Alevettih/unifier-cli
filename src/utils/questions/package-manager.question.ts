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
          task.title = `Preferred package manager: ${cyan(ctx.packageManager)}`;
        }
      }
    ];
  }

  private _shouldEnableTask({ isYarnAvailable }: IContext): boolean {
    return isYarnAvailable;
  }

  private get _choices(): PackageManager[] {
    return ['npm', 'yarn'];
  }

  private async _ask(task: ListrTaskWrapper<IContext, any>): Promise<PackageManager> {
    return await task.prompt<PackageManager>({
      type: 'select',
      message: 'Preferred package manager:',
      choices: this._choices
    });
  }
}
