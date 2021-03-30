import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassType } from 'class-transformer/esm2015';
import { List } from '@models/classes/_base.model';

export function toModelsList<T>(Model: ClassType<T>): OperatorFunction<List<T>, List<T>> {
  return (input$: Observable<List<T>>): Observable<List<T>> => input$.pipe(map((data: List<T>): List<T> => new List(data, Model)));
}
