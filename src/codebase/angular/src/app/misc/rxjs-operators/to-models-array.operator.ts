import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertToModelsArrayFunction } from '@misc/helpers/model-conversion/convert-to-models-array.function';
import { ClassConstructor } from 'class-transformer';

export function toModelsArray<T, R>(Model: ClassConstructor<R>): OperatorFunction<T[], R[]> {
  return (input$: Observable<T[]>): Observable<R[]> => input$.pipe(map((data: T[]): R[] => convertToModelsArrayFunction(data, Model)));
}
