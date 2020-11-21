import { ClassType } from 'class-transformer/ClassTransformer';
import { plainToClass } from 'class-transformer';

export function convertToModelsArray<T>(values: any[], ModelClass: ClassType<T>): T[] {
  return values?.map((value: any): T => plainToClass(ModelClass, value) as T);
}
