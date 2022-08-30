import * as deepMerge from 'deepmerge';
import { getEmptyTarget } from '@utils/helpers/getters/get-empty-target.helper';

export function clone(value: any, options: deepMerge.Options): object {
  return deepMerge(getEmptyTarget(value), value, options);
}
