import { ClassConstructor, plainToInstance } from 'class-transformer';

export function convertToModel<T>(value: any, ModelClass: ClassConstructor<T>): T {
  if (value && typeof value === 'object') {
    return plainToInstance(ModelClass, value) as unknown as T;
  } else {
    return value;
  }
}
