import { Observable } from 'rxjs';
import { IAppContext } from '@interface/app-context.interface';
import { commandWithOutput } from '@helpers/command-with-output.helper';

export function initWorkspaceTask({ title, skipGit, ngCommand }: IAppContext): Observable<string> {
  return commandWithOutput(
    `${ngCommand} new ${title} --style=scss --routing --skip-install --skip-git=${skipGit}`.trim()
  );
}
