import getPort from 'get-port';
import { ListrTaskWrapper } from 'listr2';
import { command, ExecaReturnValue } from 'execa';
import { ProjectType } from '@enum/project-type.enum';
import { IAppContext } from '@interface/app-context.interface';
import { IAngularInfo } from '@interface/angular-info.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { isYarnAvailable } from '@helpers/verifications/is-yarn-available.helper';

export async function checkDependenciesDataTask(
  ctx: IAppContext,
  task: ListrTaskWrapper<IAppContext, any>
): Promise<void> {
  task.output = OutputFormatter.info('Check Yarn availability...');
  ctx.isYarnAvailable = await isYarnAvailable();

  if (!ctx.type || ctx.type === ProjectType.ANGULAR) {
    task.output = OutputFormatter.info('Fetch info about Angular and codebase versions...');
    ctx.angularInfo = await getAngularInfo();
  }

  task.output = OutputFormatter.info('Get available ports...');
  ctx.port = await getPort();

  ctx.packageManager = 'npm';
}

async function getAngularInfo(): Promise<IAngularInfo> {
  try {
    const { stdout: angularInfo }: ExecaReturnValue = await command(`npm view @angular/cli --json`);
    const { stdout: codebaseHeads }: ExecaReturnValue = await command(
      `git ls-remote --refs git@github.com:unifier-tool/codebase-angular.git`
    );
    const { 'dist-tags': tags, versions } = JSON.parse(angularInfo);
    const codebaseVersions: number[] = codebaseHeads
      .replace(/([a-z0-9]+)\s+refs\/heads\/(\d+)\.(x|\d)+\.(x|\d)+/gm, '$2')
      .split('\n')
      .map((item: string): number => Number(item))
      .filter((item: number): boolean => !isNaN(item))
      .sort();

    return { tags, versions, codebaseVersions };
  } catch (e) {
    return { tags: {}, versions: [], codebaseVersions: [] };
  }
}
