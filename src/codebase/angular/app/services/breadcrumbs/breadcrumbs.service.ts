import { Injectable, OnDestroy } from '@angular/core';
import { Router, ActivationEnd, NavigationEnd, RouterEvent, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { filter, map, buffer, pluck } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs';

export interface Breadcrumb {
  name: string;
  url: string;
}

interface BreadcrumbDataWithId {
  bcData: ActivatedRouteSnapshot[],
  id: string;
}

type CheckFunction = (event: RouterEvent) => boolean;
const isNavigationEnd: CheckFunction = (ev: RouterEvent): boolean => ev instanceof NavigationEnd;
const isActivationEnd: CheckFunction = (ev: RouterEvent): boolean => ev instanceof ActivationEnd;

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService implements OnDestroy {
  private routerEventsSubscription: Subscription;
  private collection: Breadcrumb[];
  private readonly bcForDisplay$: BehaviorSubject<Breadcrumb[]>;
  private readonly ID_MASK: string = ':id';

  constructor(private router: Router) {
    this.bcForDisplay$ = new BehaviorSubject([]);
    const navigationEnd$: Observable<RouterEvent> = this.router.events.pipe(filter(isNavigationEnd));

    this.routerEventsSubscription = this.router.events
      .pipe(
        filter<RouterEvent>(isActivationEnd),
        pluck<RouterEvent, ActivatedRouteSnapshot>('snapshot'),
        buffer<ActivatedRouteSnapshot>(navigationEnd$),
        map<ActivatedRouteSnapshot[], ActivatedRouteSnapshot[]>(
          (bcData: ActivatedRouteSnapshot[]): ActivatedRouteSnapshot[] => bcData.reverse()
        ),
        map<ActivatedRouteSnapshot[], BreadcrumbDataWithId>(
          (bcData: ActivatedRouteSnapshot[]): BreadcrumbDataWithId => {
            const foundParams: string[] = bcData
              .filter((data: ActivatedRouteSnapshot): string => data.params?.id)
              .map((data: ActivatedRouteSnapshot): string => data.params.id);

            return {
              bcData,
              id: foundParams[0]
            };
          }
        )
      )
      .subscribe(({ bcData, id }: BreadcrumbDataWithId): void => {
        const bcLoadedData: ActivatedRouteSnapshot[] = bcData.filter(
          ({ data }: ActivatedRouteSnapshot): string => data.breadcrumb
        );
        this.collection = bcLoadedData.reduce(
          (rootAcc: Breadcrumb[], { data, pathFromRoot }: ActivatedRouteSnapshot): Breadcrumb[] => {
            let breadcrumb: Breadcrumb;

            if (data.breadcrumb === this.ID_MASK && id !== undefined) {
              data.breadcrumb = id;
            }

            if (data.breadcrumb && !rootAcc.some((item: Breadcrumb): boolean => data.breadcrumb === item.name)) {
              breadcrumb = {
                name: data.breadcrumb,
                url: pathFromRoot
                  .map((v: ActivatedRouteSnapshot): string =>
                    v.url.map((segment: UrlSegment): string => segment.toString()).join('/')
                  )
                  .join('/')
              };
            }
            return breadcrumb ? [...rootAcc, breadcrumb] : [...rootAcc];
          },
          []
        );

        this.bcForDisplay$.next(this.collection);
      });
  }

  add(breadcrumb: Breadcrumb): void {
    this.collection.push(breadcrumb);
    this.bcForDisplay$.next(this.collection);
  }

  update(): void {
    this.bcForDisplay$.next(this.collection);
  }

  ngOnDestroy(): void {
    this.routerEventsSubscription.unsubscribe();
  }

  get breadcrumbs$(): BehaviorSubject<Breadcrumb[]> {
    return this.bcForDisplay$;
  }
}
