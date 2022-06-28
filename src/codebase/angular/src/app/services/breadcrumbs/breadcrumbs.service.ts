import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, ActivationEnd, Event, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { buffer, filter, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { IBreadcrumb } from '@models/interfaces/breadcrumbs/breadcrumb.interface';

type CheckFunction<T extends Event> = (event: Event) => event is T;
const isNavigationEnd: CheckFunction<NavigationEnd> = (ev: Event): ev is NavigationEnd => ev instanceof NavigationEnd;
const isActivationEnd: CheckFunction<ActivationEnd> = (ev: Event): ev is ActivationEnd => ev instanceof ActivationEnd;

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService implements OnDestroy {
  private _routerEventsSubscription: Subscription;
  private _collection: IBreadcrumb[];
  private readonly _bcForDisplay$: BehaviorSubject<IBreadcrumb[]>;
  private readonly _DYNAMIC_BREADCRUMB_PREFIX: string = ':';

  constructor(private _router: Router) {
    this._bcForDisplay$ = new BehaviorSubject([]);
    const navigationEnd$: Observable<NavigationEnd> = this._router.events.pipe(filter(isNavigationEnd));

    this._routerEventsSubscription = this._router.events
      .pipe(
        filter<Event, ActivationEnd>(isActivationEnd),
        map(({ snapshot }: ActivationEnd): ActivatedRouteSnapshot => snapshot),
        buffer<ActivatedRouteSnapshot>(navigationEnd$),
        map<ActivatedRouteSnapshot[], ActivatedRouteSnapshot[]>((bcData: ActivatedRouteSnapshot[]): ActivatedRouteSnapshot[] =>
          bcData.reverse()
        )
      )
      .subscribe((bcData: ActivatedRouteSnapshot[]): void => {
        const bcLoadedData: ActivatedRouteSnapshot[] = bcData.filter(({ data }: ActivatedRouteSnapshot): string => data.breadcrumb);
        this._collection = bcLoadedData.reduce((rootAcc: IBreadcrumb[], { data, pathFromRoot }: ActivatedRouteSnapshot): IBreadcrumb[] => {
          let breadcrumb: IBreadcrumb;
          const dynamicKey: string = data.breadcrumb.startsWith(this._DYNAMIC_BREADCRUMB_PREFIX)
            ? data.breadcrumb.replace(this._DYNAMIC_BREADCRUMB_PREFIX, '')
            : null;

          if (dynamicKey && data?.entity?.[dynamicKey]) {
            data.breadcrumb = data?.entity?.[dynamicKey];
          }

          if (data.breadcrumb && !rootAcc.some((item: IBreadcrumb): boolean => data.breadcrumb === item.name)) {
            breadcrumb = {
              name: data.breadcrumb,
              url: pathFromRoot
                .map((v: ActivatedRouteSnapshot): string => v.url.map((segment: UrlSegment): string => segment.toString()).join('/'))
                .join('/')
            };
          }
          return breadcrumb ? [...rootAcc, breadcrumb] : [...rootAcc];
        }, []);

        this._bcForDisplay$.next(this._collection);
      });
  }

  add(breadcrumb: IBreadcrumb): void {
    this._collection.push(breadcrumb);
    this._bcForDisplay$.next(this._collection);
  }

  update(): void {
    this._bcForDisplay$.next(this._collection);
  }

  ngOnDestroy(): void {
    this._routerEventsSubscription.unsubscribe();
  }

  get breadcrumbs$(): BehaviorSubject<IBreadcrumb[]> {
    return this._bcForDisplay$;
  }
}
