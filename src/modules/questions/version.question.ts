import { AbstractQuestion } from '@src/misc/abstracts/question.abstract';
import { IAppContext } from '@src/types/interface/app-context.interface';
import { ListrTask, ListrTaskWrapper, PromptOptions } from 'listr2';
import { ProjectType } from '@src/types/enum/project-type.enum';
import { major, satisfies } from 'semver';
import { dim, green, red } from 'ansi-colors';
import { OutputFormatter } from '@helpers/output-formatter.helper';

export class VersionQuestion extends AbstractQuestion<string> {
  private _optimizationStateReady: string = green('•');
  private _optimizationStateNotReady: string = red('•');

  get tasks(): ListrTask[] {
    return [
      {
        enabled: this._shouldEnableTask,
        task: async (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>) => {
          this._showHint(task);

          const version = await this._ask(task, ctx);
          const codebaseVersion: number = ctx.angularInfo.codebaseVersions.includes(major(version))
            ? major(version)
            : ctx.angularInfo.codebaseVersions[ctx.angularInfo.codebaseVersions.length - 1];

          ctx.version = version;
          ctx.codebaseInfo = {
            branchName: `${codebaseVersion}.x.x`,
            version: codebaseVersion
          };
        }
      },
      {
        task: async (ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>) => {
          if (ctx.version) {
            task.title = `${this._title} ${OutputFormatter.accent(ctx.version)}`;
          }
        }
      }
    ];
  }

  protected get _title(): string {
    return 'Version:';
  }

  protected async _ask(task: ListrTaskWrapper<IAppContext, any>, ctx: IAppContext): Promise<string> {
    return await task.prompt<string>({
      type: 'select',
      message: this._title,
      choices: this._choices(ctx)
    });
  }

  private _shouldEnableTask(ctx: IAppContext): boolean {
    if (ctx.type !== ProjectType.ANGULAR) {
      return false;
    }

    const { tags, versions } = ctx.angularInfo;

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

  private _choices(ctx: IAppContext): PromptOptions[] {
    const { tags, codebaseVersions } = ctx.angularInfo;

    return Object.entries(tags)
      .filter(([, value]: [string, string]): boolean => satisfies(value, `>=${major(tags.latest) - 1}.x`))
      .map(([name, value]: [string, string]) => ({
        message: `${
          codebaseVersions.includes(major(value)) ? this._optimizationStateReady : this._optimizationStateNotReady
        } ${name}: ${dim(value)}`,
        name: value,
        value
      }));
  }

  private _showHint(task: ListrTaskWrapper<IAppContext, any>): void {
    task.output = OutputFormatter.warning(
      'Codebase optimization:',
      `${this._optimizationStateReady} - ready.`,
      `${this._optimizationStateNotReady} - optimization needed, use it at your own risk.`
    );
  }
}
