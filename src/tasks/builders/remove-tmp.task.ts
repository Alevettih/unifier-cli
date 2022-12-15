import { removeSync } from 'fs-extra';
import { IAppContext } from '@interface/app-context.interface';

export function removeTmpTask({ directories: { base } }: IAppContext): void {
  return removeSync(base.tmp);
}
