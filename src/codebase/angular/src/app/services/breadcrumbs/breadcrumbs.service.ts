import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, ActivationEnd, NavigationEnd, Router, RouterEvent, UrlSegment } from '@angular/router';
import { buffer, filter, map, pluck } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { IBreadcrumb } from '@models/interfaces/breadcrumbs/breadcrumb.interface';
import { IBreadcrumbDataWithId } from '@models/interfaces/breadcrumbs/breadcrumb-data-with-id.interface';

type CheckFunction = (event: RouterEvent) => boolean;
const isNavigationEnd: CheckFunction = (ev: RouterEvent): boolean => ev instanceof NavigationEnd;
const isActivationEnd: CheckFunction = (ev: RouterEvent): boolean => ev instanceof ActivationEnd;

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService implements OnDestroy {
  private _routerEventsSubscription: Subscription;
  private _collection: IBreadcrumb[];
  private readonly _bcForDisplay$: BehaviorSubject<IBreadcrumb[]>;
  private readonly _ID_MASK: string = ':id';

  constructor(private _router: Router) {
    this._bcForDisplay$ = new BehaviorSubject([]);
    const navigationEnd$: Observable<RouterEvent> = this._router.events.pipe(filter(isNavigationEnd));

    this._routerEventsSubscription = this._router.events
      .pipe(
        filter<RouterEvent>(isActivationEnd),
        pluck<RouterEvent>('snapshot'),
        buffer<ActivatedRouteSnapshot>(navigationEnd$),
        map<ActivatedRouteSnapshot[], ActivatedRouteSnapshot[]>((bcData: ActivatedRouteSnapshot[]): ActivatedRouteSnapshot[] =>
          bcData.reverse()
        ),
        map<ActivatedRouteSnapshot[], IBreadcrumbDataWithId>((bcData: ActivatedRouteSnapshot[]): IBreadcrumbDataWithId => {
          const foundParams: string[] = bcData
            .filter((data: ActivatedRouteSnapshot): string => data.params?.id)
            .map((data: ActivatedRouteSnapshot): string => data.params.id);

          return {
            bcData,
            id: foundParams[0]
          };
        })
      )
      .subscribe(({ bcData, id }: IBreadcrumbDataWithId): void => {
        const bcLoadedData: ActivatedRouteSnapshot[] = bcData.filter(({ data }: ActivatedRouteSnapshot): string => data.breadcrumb);
        this._collection = bcLoadedData.reduce((rootAcc: IBreadcrumb[], { data, pathFromRoot }: ActivatedRouteSnapshot): IBreadcrumb[] => {
          let breadcrumb: IBreadcrumb;

          if (data.breadcrumb === this._ID_MASK && id !== undefined) {
            data.breadcrumb = id;
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
