import { Component, OnDestroy, OnInit } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, filter, map, pairwise, switchMap, takeUntil, tap } from 'rxjs/operators';
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
  readonly BASE_DATE_FORMAT: string = DATE_FORMAT.FULL;
  abstract list: List<T>;
  isLoading: boolean = false;

  constructor(
    protected queryParams: QueryParamsService,
    protected activatedRoute: ActivatedRoute,
    protected modal: ModalService,
    protected translate: TranslateService
  ) {
    super(modal, translate);
    queryParams.shouldTranslateParamsToURL = false;
  }

  ngOnInit(): void {
    merge(this.queryParams.params$, this.activatedRoute.params)
      .pipe(
        takeUntil(this.DESTROYED$),
        switchMap((): Observable<List> => this.loadItems(this.params))
      )
      .subscribe();
  }

  get params(): Params {
    return this.queryParams.params;
  }

  onFilter(fieldName: string, value: any, type: 'search' | 'date-range'): void {
    switch (type) {
      case 'search':
        this.queryParams.searchQuery((value as string)?.trim?.(), fieldName);
        break;
      case 'date-range':
        this.queryParams.addRange(fieldName, value as IDateRange);
        break;
    }

    this.queryParams.paginate(1, this.queryParams.params[QueryParamsService.BASE_KEYS.PER_PAGE]);
  }

  protected updateList(clearPagination: boolean): void {
    if (clearPagination) {
      this.queryParams.paginate(1, this.queryParams.params[QueryParamsService.BASE_KEYS.PER_PAGE]);
    } else {
      this.loadItems(this.params).subscribe();
    }
  }

  protected loadItems(params: Params): Observable<List<T>> {
    this.isLoading = true;

    return this.getItems(params).pipe(
      takeUntil(this.DESTROYED$),
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

  protected abstract getItems(params: Params): Observable<List<T>>;
}
