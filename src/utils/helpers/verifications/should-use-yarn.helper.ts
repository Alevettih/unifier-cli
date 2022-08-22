import { IContext } from '@src/main';

export function shouldUseYarn({ packageManager, isYarnAvailable }: IContext): boolean {
  return isYarnAvailable && packageManager === 'yarn';
}
