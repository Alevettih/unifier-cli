import { Component, OnDestroy, OnInit } from '@angular/core';
import { List } from '@models/classes/_base.model';
import { merge, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { runInAnyCase } from '@misc/rxjs-operators/run-in-any-case.operator';

@Component({
  template: ''
})
export abstract class ListingApiAbstractComponent<T = any> implements OnInit, OnDestroy {
  protected readonly destroyed$: Subject<void> = new Subject<void>();
  abstract list: List<T>;
  isLoading: boolean = false;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router) {}

  ngOnInit(): void {
    merge(
      this.activatedRoute.queryParams,
      this.activatedRoute.params
    ).pipe(
      takeUntil(this.destroyed$),
      switchMap((): Observable<List> => this.loadItems(this.params))
    ).subscribe(this.onNavigationEnd.bind(this));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  get params(): Params {
    return this.activatedRoute.snapshot.queryParams;
  }

  abstract getItems(params: Params): Observable<List<T>>;

  protected loadItems(params: Params): Observable<List<T>> {
    this.isLoading = true;
    return this.getItems(params).pipe(
      takeUntil(this.destroyed$),
      runInAnyCase((): void => {
        this.isLoading = false;
      }),
      tap((list: List<T>): void => {
        this.list = list;
      })
    );
  }

  // tslint:disable-next-line:no-empty
  protected onNavigationEnd(...params: any[]): void {}
}
