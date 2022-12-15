import { join } from 'path';
import { readJsonSync } from 'fs-extra';
import { IAppContext } from '@interface/app-context.interface';
import { IPackageJson } from '@interface/package-json.interface';

export function getLintersTask(ctx: IAppContext): void {
  const json: IPackageJson = readJsonSync(join(ctx.title, 'package.json'));
  ctx.lintersKeys = Object.keys(json.scripts).filter(
    (key: string): boolean => key.includes('lint') && !/:(all|watch)/g.test(key)
  );
}
