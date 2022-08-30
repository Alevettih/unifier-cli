import { ClassConstructor, plainToInstance } from 'class-transformer';

export function convertToModel<T>(value: unknown, ModelClass: ClassConstructor<T>): T {
  if (value && typeof value === 'object') {
    return plainToInstance(ModelClass, value) as unknown as T;
  } else {
    return value as T;
  }
}
