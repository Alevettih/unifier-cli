import * as deepMerge from 'deepmerge';
import { clone } from '@utils/helpers/data-structure-manipulation/clone.helper';

export function arrayMerge(target: any[], source: any[], options: deepMerge.Options): any[] {
  const destination = target.slice();

  source.forEach((e, i) => {
    if (typeof destination[i] === 'undefined') {
      const cloneRequested = options.clone !== false;
      const shouldClone = cloneRequested && options.isMergeableObject(e);

      destination[i] = shouldClone ? clone(e, options) : e;
    } else if (options.isMergeableObject(e)) {
      destination[i] = deepMerge(target[i], e, options);
    } else if (!target.includes(e)) {
      destination.push(e);
    }
  });

  return destination;
}
