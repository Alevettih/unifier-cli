import { BehaviorSubject, Observable } from 'rxjs';
import { PER_PAGE_DEFAULT } from './constants/_base.constant';
import { Sort, SortDirection } from '@angular/material/sort';
import { Params } from '@angular/router';
import { auditTime } from 'rxjs/operators';

export interface IQueryBuilderBaseKeys {
  PAGE: string;
  PER_PAGE: string;
}

export interface IDateRange {
  start: string;
  end: string;
}

export class QueryBuilder {
  static readonly BASE_KEYS: IQueryBuilderBaseKeys = Object.freeze({
    ORDER_BY: 'order-by',
    PAGE: 'page',
    PER_PAGE: 'itemsPerPage'
  });
  private readonly _params$: BehaviorSubject<Params>;

  get params$(): Observable<Params> {
    return this._params$.pipe(auditTime(100));
  }

  get params(): Params {
    return this._params$.getValue();
  }

  constructor(defaultQuery?: Params) {
    this._params$ = new BehaviorSubject<Params>(defaultQuery ?? ({} as Params));
  }

  static parseSorting(value: string): Sort {
    const res: string[] = value?.split?.('|');

    return {
      active: res?.[0],
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

    this._params$.next(params);
    return this;
  }

  sort(field: string, direction: SortDirection): QueryBuilder {
    if (!field || !['asc', 'desc', ''].includes(direction)) {
      return;
    }
    this.clearSort();

    if (direction) {
      this._params$.next({ ...this.params, [`order[${field}]`]: direction });
    }

    return this;
  }

  searchQuery(query: string | number, fieldName: string): QueryBuilder {
    this.clearParams(fieldName);
    if (query) {
      this._params$.next({ ...this.params, [fieldName]: query });
    }
    return this;
  }

  addFilter(fieldName: string, value: any): QueryBuilder {
    this._params$.next({ ...this.params, [fieldName]: value });
    return this;
  }

  addRange(fieldName: string, value: IDateRange): QueryBuilder {
    this.clearRange(fieldName);

    if (value.start) {
      this._params$.next({ ...this.params, [`${fieldName}[after]`]: value.start });
    }

    if (value.end) {
      this._params$.next({ ...this.params, [`${fieldName}[before]`]: value.end });
    }

    return this;
  }

  clearRange(fieldName: string): QueryBuilder {
    this.clearParams(`${fieldName}[after]`, `${fieldName}[before]`);
    return this;
  }

  clearPaginate(): QueryBuilder {
    this._params$.next({
      ...this.params,
      [QueryBuilder.BASE_KEYS.PAGE]: 1,
      [QueryBuilder.BASE_KEYS.PER_PAGE]: PER_PAGE_DEFAULT
    });
    return this;
  }

  clearSort(): QueryBuilder {
    const key: string = this.getCurrentSortKey(this.params);

    if (key) {
      this.clearParams(key);
    }

    return this;
  }

  clearParams(...paramsNames: string[]): QueryBuilder {
    const params: Params = this.params;
    paramsNames.forEach((itemName: string): boolean => delete params[itemName]);
    this._params$.next(params);
    return this;
  }

  getCurrentSortKey(params: Params): string {
    return Object.keys(params).find((key: string): boolean => key.includes('order['));
  }
}
