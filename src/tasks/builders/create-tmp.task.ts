import { ensureDirSync } from 'fs-extra';
import { IAppContext } from '@interface/app-context.interface';

export function createTmpTask({ directories: { base } }: IAppContext): void {
  return ensureDirSync(base.tmp);
}
