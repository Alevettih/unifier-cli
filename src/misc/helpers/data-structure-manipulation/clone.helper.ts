import * as deepMerge from 'deepmerge';

export function clone(value: any, options: deepMerge.Options): object {
  return deepMerge((Array.isArray(value) ? [] : {}) as any, value, options);
}
