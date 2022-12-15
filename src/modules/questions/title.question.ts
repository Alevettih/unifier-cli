import { AbstractQuestion } from '@src/misc/abstracts/question.abstract';
import { IAppContext } from '@interface/app-context.interface';
import { ListrTask, ListrTaskWrapper } from 'listr2';
import { getCWD } from '@helpers/getters/get-cwd.helper';
import { isDirectoryExistsAndNotEmpty } from '@helpers/verifications/is-directory-exists-and-no-empty.helper';
import { Validators } from '@misc/validators';
import { OutputFormatter } from '@helpers/output-formatter.helper';

export class TitleQuestion extends AbstractQuestion<string> {
  get tasks(): ListrTask[] {
    return [
      {
        enabled: this._shouldAskTitle,
        task: async (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>) => {
          if (!ctx.title || (ctx.title && typeof Validators.title(ctx.title) !== 'boolean')) {
            ctx.title = await this._ask(task, ctx);
          }

          if (isDirectoryExistsAndNotEmpty(ctx.title)) {
            ctx.title = await this._ask(task, ctx);
          }
        }
      },
      {
        task: async (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>) => {
          task.title = `${this._title} ${OutputFormatter.accent(ctx.title)}`;
        }
      }
    ];
  }

  protected get _title(): string {
    return 'Project name:';
  }

  protected async _ask(task: ListrTaskWrapper<IAppContext, any>, ctx: IAppContext): Promise<string> {
    if (isDirectoryExistsAndNotEmpty(ctx.title)) {
      this._showHint(task);
    }

    return task.prompt<string>({
      type: 'input',
      message: this._title,
      initial: ctx.title || getCWD(),
      validate: Validators.title
    });
  }

  private _shouldAskTitle({ title }: IAppContext): boolean {
    return (
      !title ||
      (title && typeof Validators.title(title) !== 'boolean') ||
      (title && isDirectoryExistsAndNotEmpty(title))
    );
  }

  private _showHint(task: ListrTaskWrapper<IAppContext, any>): void {
    task.output = OutputFormatter.warning(
      'Directory with that name is already exists and contain files.',
      'Change the name or proceed with that value for erasing the directory.'
    );
  }
}
