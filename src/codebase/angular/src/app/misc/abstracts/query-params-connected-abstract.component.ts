import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterEvent } from '@angular/router';
import { QueryBuilder } from '@misc/query-builder';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  template: ''
})
export abstract class QueryParamsConnectedAbstractComponent<T = any> implements OnInit, OnDestroy {
  protected readonly DESTROYED$: Subject<void> = new Subject<void>();
  protected paramsBuilder: QueryBuilder = new QueryBuilder();

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router) {}

  ngOnInit(): void {
    this.initialize();
    this.router.events
      .pipe(
        takeUntil(this.DESTROYED$),
        filter((event: RouterEvent): boolean => event instanceof NavigationEnd)
      )
      .subscribe(this.initialize.bind(this));
  }

  ngOnDestroy(): void {
    this.DESTROYED$.next();
    this.DESTROYED$.complete();
  }

  get params(): Params {
    return this.paramsBuilder.params;
  }

  abstract get value(): T;

  abstract set value(direction: T);

  protected applyQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.params
    });
  }

  protected initialize(): void {
    const params: Params = this.activatedRoute.snapshot.queryParams;
    this.paramsBuilder = new QueryBuilder({ ...params });
  }
}
