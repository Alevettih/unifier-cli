import { plainToClass } from 'class-transformer';
import { ClassConstructor } from 'class-transformer';

export function convertToModel<T>(value: any, ModelClass: ClassConstructor<T>): T {
  if (value && typeof value === 'object') {
    return plainToClass(ModelClass, value) as unknown as T;
  } else {
    return value;
  }
}
