import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertToModel } from '@misc/helpers/model-conversion/convert-to-model.function';
import { ClassConstructor } from 'class-transformer';

export function toModel<T, R>(Model: ClassConstructor<R>): OperatorFunction<T, R> {
  return (input$: Observable<T>): Observable<R> => input$.pipe(map((data: T): R => convertToModel(data, Model)));
}
