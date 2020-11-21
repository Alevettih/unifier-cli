import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

export function convertToModel<T>(value: any, ModelClass: ClassType<T>): T {
  if (value && typeof value === 'object') {
    return plainToClass(ModelClass, value) as T;
  } else {
    return value;
  }
}
