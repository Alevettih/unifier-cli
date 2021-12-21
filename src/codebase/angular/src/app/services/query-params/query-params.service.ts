import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, tap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { auditTime, filter, map, pairwise } from 'rxjs/operators';
import { PER_PAGE_DEFAULT } from '@misc/constants/_base.constant';
import { Sort, SortDirection } from '@angular/material/sort';
import { difference } from '@misc/helpers/difference.function';

export interface IQueryBuilderBaseKeys {
  PAGE: string;
  PER_PAGE: string;
}

export interface IDateRange {
  start: string;
  end: string;
}

@Injectable({
  providedIn: 'root'
})
export class QueryParamsService {
  static readonly BASE_KEYS: IQueryBuilderBaseKeys = Object.freeze({
    ORDER_BY: 'order-by',
    PAGE: 'page',
    PER_PAGE: 'itemsPerPage'
  });
  private _params$: BehaviorSubject<Params> = new BehaviorSubject<Params>({});
  private _shouldTranslateParamsToURL: boolean = false;

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router) {}

  get shouldTranslateParamsToURL(): boolean {
    return this._shouldTranslateParamsToURL;
  }

  set shouldTranslateParamsToURL(value: boolean) {
    this._shouldTranslateParamsToURL = value;
    this._params$.next(value ? this._activatedRoute.snapshot.queryParams : {});
  }

  get params$(): Observable<Params> {
    return this._params$.pipe(auditTime(100));
  }

  get params(): Params {
    return this._params$.value;
  }

  paginate(page: number, perPage?: number): QueryParamsService {
    const params: Params = {
      ...this.params,
      [QueryParamsService.BASE_KEYS.PAGE]: page ?? 1,
      [QueryParamsService.BASE_KEYS.PER_PAGE]: perPage ?? PER_PAGE_DEFAULT
    };

    this._setParams(params);
    return this;
  }

  sort(field: string, direction: SortDirection): QueryParamsService {
    if (!field || !['asc', 'desc', ''].includes(direction)) {
      return;
    }
    this.clearSort();

    if (direction) {
      this._setParams({ ...this.params, [`order[${field}]`]: direction });
    }

    return this;
  }

  searchQuery(query: string | number, fieldName: string): QueryParamsService {
    this.clearParams(fieldName);
    if (query) {
      this._setParams({ ...this.params, [fieldName]: query });
    }
    return this;
  }

  addFilter(fieldName: string, value: any): QueryParamsService {
    this._setParams({ ...this.params, [fieldName]: value });
    return this;
  }

  addRange(fieldName: string, value: IDateRange): QueryParamsService {
    this.clearRange(fieldName);

    if (value.start) {
      this._setParams({ ...this.params, [`${fieldName}[after]`]: value.start });
    }

    if (value.end) {
      this._setParams({ ...this.params, [`${fieldName}[before]`]: value.end });
    }

    return this;
  }

  clearRange(fieldName: string): QueryParamsService {
    this.clearParams(`${fieldName}[after]`, `${fieldName}[before]`);
    return this;
  }

  clearPaginate(): QueryParamsService {
    this._setParams({
      ...this.params,
      [QueryParamsService.BASE_KEYS.PAGE]: 1,
      [QueryParamsService.BASE_KEYS.PER_PAGE]: PER_PAGE_DEFAULT
    });
    return this;
  }

  clearSort(): QueryParamsService {
    const key: string = this._getCurrentSortKey(this.params);

    if (key) {
      this.clearParams(key);
    }

    return this;
  }

  clearParams(...paramsNames: string[]): QueryParamsService {
    const params: Params = this.params;
    paramsNames.forEach((itemName: string): boolean => delete params[itemName]);
    this._setParams(params);
    return this;
  }

  parseSorting(): Sort {
    const key: string = this._getCurrentSortKey(this.params);

    if (!key) {
      return null;
    }

    const active: string = key.replace(/order\[(.*)]/gi, '$1');
    const direction: SortDirection = this.params[key];

    return { active, direction };
  }

  private _getCurrentSortKey(params: Params): string {
    return Object.keys(params).find((key: string): boolean => key.includes('order['));
  }

  private _setParams(queryParams: Params): void {
    const observable$: Observable<boolean> = this.shouldTranslateParamsToURL
      ? from(this._router.navigate([], { relativeTo: this._activatedRoute, queryParams }))
      : of(true);

    observable$.subscribe(() => {
      this._params$.next(queryParams);
    });
  }
}
