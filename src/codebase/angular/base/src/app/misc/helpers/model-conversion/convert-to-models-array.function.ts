import { ClassConstructor, plainToInstance } from 'class-transformer';

export function convertToModelsArrayFunction<T>(values: unknown[], ModelClass: ClassConstructor<T>): T[] {
  return values?.map((value: any): T => plainToInstance(ModelClass, value));
}
