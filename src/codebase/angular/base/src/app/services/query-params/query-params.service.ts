import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { auditTime } from 'rxjs/operators';
import { PER_PAGE_DEFAULT } from '@misc/constants/_base.constant';
import { Sort, SortDirection } from '@angular/material/sort';

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
  private readonly _PARAMS$: BehaviorSubject<Params> = new BehaviorSubject<Params>({});
  private _shouldTranslateParamsToURL: boolean = false;

  get shouldTranslateParamsToURL(): boolean {
    return this._shouldTranslateParamsToURL;
  }

  set shouldTranslateParamsToURL(shouldTranslateParamsToURL: boolean) {
    this._shouldTranslateParamsToURL = shouldTranslateParamsToURL;
    this._PARAMS$.next(shouldTranslateParamsToURL ? this._activatedRoute.snapshot.queryParams : {});
  }

  get params$(): Observable<Params> {
    return this._PARAMS$.pipe(auditTime(100));
  }

  get params(): Params {
    return this._PARAMS$.value;
  }

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router) {}

  paginate(page: number, perPage?: number): this {
    const params: Params = {
      ...this.params,
      [QueryParamsService.BASE_KEYS.PAGE]: page ?? 1,
      [QueryParamsService.BASE_KEYS.PER_PAGE]: perPage ?? PER_PAGE_DEFAULT
    };

    this._setParams(params);
    return this;
  }

  sort(field: string, direction: SortDirection): this {
    if (!field || !['asc', 'desc', ''].includes(direction)) {
      return null;
    }
    this.clearSort();

    if (direction) {
      this._setParams({ ...this.params, [`order[${field}]`]: direction });
    }

    return this;
  }

  searchQuery(query: string | number, fieldName: string): this {
    this.clearParams(fieldName);
    if (query) {
      this._setParams({ ...this.params, [fieldName]: query });
    }
    return this;
  }

  addFilter(fieldName: string, value: string | number): this {
    this._setParams({ ...this.params, [fieldName]: value });
    return this;
  }

  addRange(fieldName: string, value: IDateRange): this {
    this.clearRange(fieldName);

    if (value.start) {
      this._setParams({ ...this.params, [`${fieldName}[after]`]: value.start });
    }

    if (value.end) {
      this._setParams({ ...this.params, [`${fieldName}[before]`]: value.end });
    }

    return this;
  }

  clearRange(fieldName: string): this {
    this.clearParams(`${fieldName}[after]`, `${fieldName}[before]`);
    return this;
  }

  clearPaginate(): this {
    this._setParams({
      ...this.params,
      [QueryParamsService.BASE_KEYS.PAGE]: 1,
      [QueryParamsService.BASE_KEYS.PER_PAGE]: PER_PAGE_DEFAULT
    });
    return this;
  }

  clearSort(): this {
    const key: string = this._getCurrentSortKey(this.params);

    if (key) {
      this.clearParams(key);
    }

    return this;
  }

  clearParams(...paramsNames: string[]): this {
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
      this._PARAMS$.next(queryParams);
    });
  }
}
