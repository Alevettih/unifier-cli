import { IQuestion } from '@utils/questions/index';
import { ListrTask, ListrTaskWrapper, PromptOptions } from 'listr2';
import { IContext } from '@src/main';
import { ProjectType } from '@src/project-types';
import { major, satisfies } from 'semver';
import { cyan, grey } from 'ansi-colors';

export class VersionQuestion implements IQuestion {
  get tasks(): ListrTask[] {
    return [
      {
        enabled: this._shouldEnableTask,
        task: async (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          ctx.version = await this._ask(ctx, task);
        }
      },
      {
        task: async (ctx: IContext, task: ListrTaskWrapper<IContext, any>) => {
          task.title = `${this._title} ${cyan(ctx.version)}`;
        }
      }
    ];
  }

  private get _title(): string {
    return 'Version:';
  }

  private _shouldEnableTask(ctx: IContext): boolean {
    const { tags, versions } = ctx.angularInfo;

    if (ctx.type !== ProjectType.ANGULAR) {
      return false;
    }

    if (!ctx.version) {
      return true;
    } else {
      const isVersionAvailable = Boolean(tags[ctx.version] || versions.includes(ctx.version));

      if (isVersionAvailable) {
        ctx.version = tags[ctx.version] || ctx.version;
      }

      return !isVersionAvailable;
    }
  }

  private async _ask(ctx: IContext, task: ListrTaskWrapper<IContext, any>): Promise<string> {
    return await task.prompt<string>({
      type: 'select',
      message: this._title,
      choices: this._choices(ctx)
    });
  }

  private _choices(ctx: IContext): PromptOptions[] {
    const { tags } = ctx.angularInfo;

    return Object.entries(tags)
      .filter(([, value]: [string, string]): boolean => satisfies(value, `>=${major(tags.latest) - 1}.x`))
      .map(([name, value]: [string, string]) => ({ message: `${name}: ${grey(value)}`, name: value, value }));
  }
}
