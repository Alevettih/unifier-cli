import { ClassConstructor, TransformFnParams } from 'class-transformer';
import { convertToModelsArrayFunction } from '@misc/helpers/model-conversion/convert-to-models-array.function';

export function transformToModelsArray<T>(ModelClass: ClassConstructor<T>): (params: TransformFnParams) => T[] {
  return ({ value }: TransformFnParams): T[] => convertToModelsArrayFunction(value, ModelClass);
}
