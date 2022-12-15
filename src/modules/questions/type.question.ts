import { AbstractQuestion } from '@src/misc/abstracts/question.abstract';
import { IAppContext } from '@interface/app-context.interface';
import { ListrTask, ListrTaskWrapper } from 'listr2';
import { ProjectType } from '@enum/project-type.enum';
import { OutputFormatter } from '@helpers/output-formatter.helper';

export class TypeQuestion extends AbstractQuestion<ProjectType> {
  get tasks(): ListrTask[] {
    return [
      {
        enabled: (ctx: any) => !ctx.type || !Object.values(ProjectType).includes(ctx.type),
        task: async (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>) => {
          ctx.type = await this._ask(task, ctx);
        }
      },
      {
        task: async (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>) => {
          task.title = `${this._title} ${OutputFormatter.accent(ctx.type)}`;
        }
      }
    ];
  }

  protected get _title(): string {
    return 'Project type:';
  }

  protected async _ask(task: ListrTaskWrapper<IAppContext, any>, ctx: IAppContext): Promise<ProjectType> {
    const shouldShowWarning: boolean = ctx.type && !Object.values(ProjectType).includes(ctx.type);
    if (shouldShowWarning) {
      this._showHint(task);
    }

    return await task.prompt<ProjectType>({
      type: 'select',
      message: this._title,
      choices: Object.values(ProjectType)
    });
  }

  private _showHint(task: ListrTaskWrapper<IAppContext, any>): void {
    task.output = OutputFormatter.warning('Invalid project type!', 'Please choose correct type from list.');
  }
}
