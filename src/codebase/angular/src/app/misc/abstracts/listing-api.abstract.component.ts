import { Component, OnDestroy, OnInit } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '@shared/modal/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpServiceError } from '@services/http/http-service-error.class';
import { CrudHelpersAbstractComponent } from '@misc/abstracts/crud-helpers.abstract.component';
import { List } from '@models/classes/_list.model';
import { DATE_FORMAT } from '@misc/constants/_base.constant';
import { IDateRange, QueryParamsService } from '@services/query-params/query-params.service';

@Component({
  template: '',
  providers: [QueryParamsService]
})
export abstract class ListingApiAbstractComponent<T = any> extends CrudHelpersAbstractComponent<T> implements OnInit, OnDestroy {
  isLoading: boolean = false;
  readonly BASE_DATE_FORMAT: string = DATE_FORMAT.FULL;
  abstract list: List<T>;

  get params(): Params {
    return this._queryParams.params;
  }

  protected constructor(
    protected _queryParams: QueryParamsService,
    protected _activatedRoute: ActivatedRoute,
    protected override _modal: ModalService,
    protected override _translate: TranslateService
  ) {
    super(_modal, _translate);
    _queryParams.shouldTranslateParamsToURL = false;
  }

  ngOnInit(): void {
    merge(this._queryParams.params$, this._activatedRoute.params)
      .pipe(
        takeUntil(this._DESTROYED$),
        switchMap((): Observable<List> => this._loadItems(this.params))
      )
      .subscribe();
  }

  onFilter(fieldName: string, value: unknown, type: 'search' | 'date-range'): void {
    switch (type) {
      case 'search':
        this._queryParams.searchQuery((value as string)?.trim?.(), fieldName);
        break;
      case 'date-range':
        this._queryParams.addRange(fieldName, value as IDateRange);
        break;
    }

    this._queryParams.paginate(1, this._queryParams.params[QueryParamsService.BASE_KEYS.PER_PAGE]);
  }

  protected _updateList(shouldClearPagination: boolean): void {
    if (shouldClearPagination) {
      this._queryParams.paginate(1, this._queryParams.params[QueryParamsService.BASE_KEYS.PER_PAGE]);
    } else {
      this._loadItems(this.params).subscribe();
    }
  }

  protected _loadItems(params: Params): Observable<List<T>> {
    this.isLoading = true;

    return this._getItems(params).pipe(
      takeUntil(this._DESTROYED$),
      catchError((err: HttpServiceError): Observable<never> => {
        this.list = { entities: [], total: 0 };
        this.isLoading = false;
        throw err;
      }),
      tap((list: List<T>): void => {
        this.list = list;
        this.isLoading = false;
      })
    );
  }

  protected abstract _getItems(params: Params): Observable<List<T>>;
}
