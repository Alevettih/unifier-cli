import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/esm2015';

export function convertToModel<T>(value: any, ModelClass: ClassType<T>): T {
  if (value && typeof value === 'object') {
    return plainToClass(ModelClass, value) as unknown as T;
  } else {
    return value;
  }
}
