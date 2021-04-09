import { ClassConstructor } from 'class-transformer';
import { plainToClass } from 'class-transformer';

export function convertToModelsArray<T>(values: any[], ModelClass: ClassConstructor<T>): T[] {
  return values?.map((value: any): T => plainToClass(ModelClass, value) as unknown as T);
}
