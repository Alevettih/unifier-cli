import { Component, OnDestroy, OnInit } from '@angular/core';
import { List } from '@models/classes/_base.model';
import { ISortingItem } from '@models/interfaces/sorting-item.interface';
import { IFilteringItem } from '@models/interfaces/filtering-item.interface';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';
import { runInAnyCase } from '@misc/rxjs-operators/run-in-any-case.operator';

@Component({
  template: ''
})
export abstract class ListingApiAbstractComponent<T = any> implements OnInit, OnDestroy {
  protected readonly destroyed$: Subject<void> = new Subject<void>();
  abstract list: List<T>;
  abstract sorting: ISortingItem[];
  abstract filtering: IFilteringItem[];
  isLoading: boolean = false;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(this.onNavigationEnd.bind(this));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  get params(): Params {
    return this.activatedRoute.snapshot.queryParams;
  }

  abstract getItems(params: Params): Observable<List<T>>;

  protected onNavigationEnd(): void {
    this.isLoading = true;
    this.getItems(this.params)
      .pipe(
        takeUntil(this.destroyed$),
        runInAnyCase((): void => {
          this.isLoading = false;
        }),
        tap((list: List<T>): void => {
          this.list = list;
        })
      )
      .subscribe();
  }
}
