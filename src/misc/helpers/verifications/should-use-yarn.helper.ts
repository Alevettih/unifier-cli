import { IAppContext } from '@interface/app-context.interface';

export function shouldUseYarn({ packageManager, isYarnAvailable }: IAppContext): boolean {
  return isYarnAvailable && packageManager === 'yarn';
}
