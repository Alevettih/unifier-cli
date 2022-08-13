import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor } from 'class-transformer';
import { List } from '@models/classes/_list.model';

export function toModelsList<T>(Model: ClassConstructor<T>): OperatorFunction<List<T>, List<T>> {
  return (input$: Observable<List<T>>): Observable<List<T>> => input$.pipe(map((data: List<T>): List<T> => new List(data, Model)));
}
