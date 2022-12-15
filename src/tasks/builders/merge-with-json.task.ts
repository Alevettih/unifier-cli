import * as deepMerge from 'deepmerge';
import { readJsonSync, writeJsonSync } from 'fs-extra';

export function mergeWithJsonTask<T extends object>(pathToJson: string, objToMerge: object): void {
  return writeJsonSync(
    pathToJson,
    deepMerge(readJsonSync(pathToJson), objToMerge, {
      arrayMerge: (target: any[], source: any[]): any[] => source
    }),
    { spaces: 2 }
  );
}
