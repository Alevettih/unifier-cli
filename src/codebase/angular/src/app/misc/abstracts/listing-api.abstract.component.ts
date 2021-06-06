import { Component, OnDestroy, OnInit } from '@angular/core';
import { List } from '@models/classes/_base.model';
import { merge, Observable, throwError } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HttpServiceError } from '@services/http/http-service-error.class';
import { CrudHelpersAbstractComponent } from '@misc/abstracts/crud-helpers.abstract.component';

@Component({
  template: ''
})
export abstract class ListingApiAbstractComponent<T = any> extends CrudHelpersAbstractComponent<T> implements OnInit, OnDestroy {
  readonly BASE_DATE_FORMAT: string = 'dd/MM/yyyy HH:mm:ss';
  abstract list: List<T>;
  isLoading: boolean = false;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
    protected translate: TranslateService
  ) {
    super(dialog, translate);
  }

  ngOnInit(): void {
    merge(this.activatedRoute.queryParams, this.activatedRoute.params)
      .pipe(
        takeUntil(this.DESTROYED$),
        switchMap((): Observable<List> => this.loadItems(this.params))
      )
      .subscribe(this.onNavigationEnd.bind(this));
  }

  get params(): Params {
    return this.activatedRoute.snapshot.queryParams;
  }

  protected updateList(isDelete: boolean): void {
    const queryParams: Params = this.activatedRoute?.snapshot?.queryParams;
    if (isDelete) {
      const params: Params = { ...this.params, page: 1 };
      if (queryParams.hasOwnProperty('page') || queryParams.hasOwnProperty('per-page')) {
        this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: params });
      } else {
        this.loadItems(params).subscribe();
      }
    } else {
      this.loadItems(this.params).subscribe();
    }
  }

  onAfterRemove(): void {
    this.updateList(true);
  }

  onAfterEdit(): void {
    this.updateList(false);
  }

  onAfterCreate(): void {
    this.updateList(false);
  }

  // tslint:disable-next-line:no-empty
  protected onNavigationEnd(...params: any[]): void {}

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
