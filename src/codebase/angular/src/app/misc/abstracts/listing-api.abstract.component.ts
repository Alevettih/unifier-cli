import { Component, OnDestroy, OnInit } from '@angular/core';
import { merge, Observable, throwError } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '@shared/modal/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpServiceError } from '@services/http/http-service-error.class';
import { CrudHelpersAbstractComponent } from '@misc/abstracts/crud-helpers.abstract.component';
import { List } from '@models/classes/_list.model';
import { DATE_FORMAT } from '@misc/constants/_base.constant';
import { IDateRange, QueryBuilder } from '@misc/query-builder';

@Component({
  template: ''
})
export abstract class ListingApiAbstractComponent<T = any> extends CrudHelpersAbstractComponent<T> implements OnInit, OnDestroy {
  readonly BASE_DATE_FORMAT: string = DATE_FORMAT.FULL;
  readonly QUERY_PARAMS: QueryBuilder = new QueryBuilder();
  abstract list: List<T>;
  isLoading: boolean = false;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modal: ModalService,
    protected translate: TranslateService
  ) {
    super(modal, translate);
  }

  ngOnInit(): void {
    merge(this.QUERY_PARAMS.params$, this.activatedRoute.params)
      .pipe(
        takeUntil(this.DESTROYED$),
        switchMap((): Observable<List> => this.loadItems(this.params))
      )
      .subscribe();
  }

  get params(): Params {
    return this.QUERY_PARAMS.params;
  }

  onFilter(fieldName: string, value: any, type: 'search' | 'date-range'): void {
    switch (type) {
      case 'search':
        this.QUERY_PARAMS.searchQuery((value as string)?.trim?.(), fieldName);
        break;
      case 'date-range':
        this.QUERY_PARAMS.addRange(fieldName, value as IDateRange);
        break;
    }

    this.QUERY_PARAMS.paginate(1, this.QUERY_PARAMS.params[QueryBuilder.BASE_KEYS.PER_PAGE]);
  }

  onSort(data: Params): void {
    this.QUERY_PARAMS.sort(data?.active, data.direction);
  }

  protected updateList(clearPagination: boolean): void {
    if (clearPagination) {
      this.QUERY_PARAMS.paginate(1, this.QUERY_PARAMS.params[QueryBuilder.BASE_KEYS.PER_PAGE]);
    } else {
      this.loadItems(this.params).subscribe();
    }
  }

  protected loadItems(params: Params): Observable<List<T>> {
    this.isLoading = true;
    return this.getItems(params).pipe(
      takeUntil(this.DESTROYED$),
      catchError((err: HttpServiceError): Observable<never> => {
        this.isLoading = false;
        return throwError(err);
      }),
      tap((list: List<T>): void => {
        this.list = list;
        this.isLoading = false;
      })
    );
  }

  protected abstract getItems(params: Params): Observable<List<T>>;
}
