import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertToModelsArray } from '@misc/helpers/model-conversion/convert-to-models-array';
import { ClassType } from 'class-transformer/ClassTransformer';

export function toModelsArray<T, R>(Model: ClassType<R>): OperatorFunction<T[], R[]> {
  return (input$: Observable<T[]>): Observable<R[]> => input$.pipe(map((data: T[]): R[] => convertToModelsArray(data, Model)));
}
