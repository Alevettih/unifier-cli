import { isEqual, transform } from 'lodash';
import { typeOf } from '@misc/helpers/typeof.function';

export function difference<T extends object>(object: T, base: any): Partial<T> {
  return transform(object, (result: Partial<T>, value: any, key: string): void => {
    if (!isEqual(value, base[key])) {
      result[key as keyof T] = typeOf(value, 'strict-object') && typeOf(base[key], 'strict-object') ? difference(value, base[key]) : value;
    }
  });
}
