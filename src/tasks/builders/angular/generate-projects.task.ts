import { Listr, ListrTask } from 'listr2';
import { IAppInfo } from '@interface/app-info.interface';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { commandWithOutput } from '@helpers/command-with-output.helper';

export function generateProjectsTask({ applicationsInfo }: IAppContext): Listr {
  return new Listr(
    applicationsInfo.map(
      ({ name }: IAppInfo): ListrTask => ({
        title: `Generate ${OutputFormatter.accent(name)} project`,
        task: ({ ngCommand, childProcessOptions }: IAppContext) =>
          commandWithOutput(`${ngCommand} generate app ${name} --routing --style scss`, childProcessOptions)
      })
    )
  );
}
