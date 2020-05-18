import { formatDate } from '@angular/common';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

function dateFormatter(value: string | number | Date, format: string = 'dd-MM-yyyy HH:mm:ss', timezone: string): string {
  return formatDate(value, format, 'en', timezone);
}

export function convertToModel<T>(value: any, ModelClass: ClassType<T>): T {
  if (value && typeof value === 'object') {
    return plainToClass(ModelClass, value) as T;
  } else {
    return value;
  }
}

export function convertToModelsArray<T>(values: any[], ModelClass: ClassType<T>): T[] {
  return values?.map((value: any): T => plainToClass(ModelClass, value) as T);
}
