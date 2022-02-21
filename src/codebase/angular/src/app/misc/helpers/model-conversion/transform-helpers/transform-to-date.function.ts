import { TransformFnParams } from 'class-transformer';

export function transformToDate({ value }: TransformFnParams): Date {
  return value ? new Date(value) : null;
}
