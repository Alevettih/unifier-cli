import { BehaviorSubject } from 'rxjs';
import { PER_PAGE_DEFAULT } from './constants/_base.constant';
import { SortDirection } from '@angular/material/sort';
import { Params } from '@angular/router';
import { IParsedSorting } from '@models/interfaces/query-builder/parsed-sorting.interface';
import { IQueryBuilderBaseKeys } from '@models/interfaces/query-builder/query-builder-base-keys.interface';

export class QueryBuilder {
  static readonly BASE_KEYS: IQueryBuilderBaseKeys = Object.freeze({
    ORDER_BY: 'order-by',
    PAGE: 'page',
    PER_PAGE: 'per-page'
  });
  private params$: BehaviorSubject<Params>;

  get params(): Params {
    return this.params$.getValue();
  }

  constructor(defaultQuery?: Params) {
    this.params$ = new BehaviorSubject<Params>(defaultQuery ?? ({} as Params));
  }

  static parseSorting(value: string): IParsedSorting {
    const res: string[] = value?.split?.('|');

    return {
      field: res?.[0],
      direction: res?.[1] as SortDirection
    };
  }

  get hasPagination(): boolean {
    return this.params[QueryBuilder.BASE_KEYS.PAGE] && this.params[QueryBuilder.BASE_KEYS.PER_PAGE];
  }

  paginate(page: number, perPage?: number): QueryBuilder {
    const params: Params = {
      ...this.params,
      [QueryBuilder.BASE_KEYS.PAGE]: page ?? 1,
      [QueryBuilder.BASE_KEYS.PER_PAGE]: perPage ?? PER_PAGE_DEFAULT
    };

    this.params$.next(params);
    return this;
  }

  sort(field: string, direction: SortDirection): QueryBuilder {
    if (!field || !['asc', 'desc', null].includes(direction)) {
      return;
    }

    if (direction) {
      this.params$.next({ ...this.params, [QueryBuilder.BASE_KEYS.ORDER_BY]: `${field}|${direction}` });
    } else {
      this.clearSort();
    }

    return this;
  }

  searchQuery(query: string | number, fieldName: string): QueryBuilder {
    this.params$.next({ ...this.params, [fieldName]: query });
    return this;
  }

  addFilter(fieldName: string, value: any): QueryBuilder {
    this.params$.next({ ...this.params, [fieldName]: value });
    return this;
  }

  clearPaginate(): QueryBuilder {
    this.params$.next({
      ...this.params,
      [QueryBuilder.BASE_KEYS.PAGE]: 1,
      [QueryBuilder.BASE_KEYS.PER_PAGE]: PER_PAGE_DEFAULT
    });
    return this;
  }

  clearSort(): QueryBuilder {
    this.clearParams(QueryBuilder.BASE_KEYS.ORDER_BY);
    return this;
  }

  clearParams(...paramsNames: string[]): QueryBuilder {
    const params: Params = this.params;
    paramsNames.forEach((itemName: string): boolean => delete params[itemName]);
    this.params$.next(params);
    return this;
  }
}
