import { major } from 'semver';
import { Observable } from 'rxjs';
import { IAppContext } from '@interface/app-context.interface';
import { commandWithOutput } from '@helpers/command-with-output.helper';

export function ngAddTask(collection: string): (ctx: IAppContext) => Observable<string> {
  return ({ childProcessOptions, ngCommand, version }: IAppContext) => {
    const collectionName: string = `${collection}@${version ? major(version) : 'latest'}`;

    return commandWithOutput(`${ngCommand} add ${collectionName} --skip-confirmation --verbose`, childProcessOptions);
  };
}
