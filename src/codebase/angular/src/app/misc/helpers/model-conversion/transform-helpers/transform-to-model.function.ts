import { ClassConstructor, TransformFnParams } from 'class-transformer';
import { convertToModel } from '@misc/helpers/model-conversion/convert-to-model.function';

export function transformToModel<T>(ModelClass: ClassConstructor<T>): (params: TransformFnParams) => T {
  return ({ value }: TransformFnParams): T => convertToModel(value, ModelClass);
}
