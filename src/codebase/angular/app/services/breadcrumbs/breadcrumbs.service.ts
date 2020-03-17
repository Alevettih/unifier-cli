import { Injectable, OnDestroy } from '@angular/core';
import { Router, Event, ActivationEnd, NavigationEnd } from '@angular/router';
import { filter, map, buffer, pluck } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';

export interface Breadcrumb {
  name: string;
  url: string;
}

const isNavigationEnd = (ev: Event) => ev instanceof NavigationEnd;
const isActivationEnd = (ev: Event) => ev instanceof ActivationEnd;

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService implements OnDestroy {
  private routerEventsSubscription: Subscription;
  private bcLoadedData;
  private collection: Breadcrumb[];
  private readonly bcForDisplay$: BehaviorSubject<Breadcrumb[]>;
  private readonly ID_MASK = ':id';

  constructor(private router: Router) {
    this.bcForDisplay$ = new BehaviorSubject([]);
    const navigationEnd$ = this.router.events.pipe(filter(isNavigationEnd));

    this.routerEventsSubscription = this.router.events
      .pipe(
        filter(isActivationEnd),
        pluck('snapshot'),
        buffer(navigationEnd$),
        map((bcData: any[]) => bcData.reverse()),
        map(bcData => {
          const foundParams = bcData.filter(data => data.params && data.params.id).map(data => data.params.id);

          return {
            bcData,
            id: foundParams[0]
          };
        })
      )
      .subscribe(({ bcData, id }) => {
        this.bcLoadedData = bcData.filter(({ data }) => data.breadcrumb);
        this.collection = this.bcLoadedData.reduce((rootAcc, { data, pathFromRoot }) => {
          let breadcrumb: Breadcrumb;

          if (data.breadcrumb === this.ID_MASK && id !== undefined) {
            data.breadcrumb = id;
          }

          if (data.breadcrumb && !rootAcc.some(item => data.breadcrumb === item.name)) {
            breadcrumb = {
              name: data.breadcrumb,
              url: pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/')
            };
          }
          return breadcrumb ? [...rootAcc, breadcrumb] : [...rootAcc];
        }, []);

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
