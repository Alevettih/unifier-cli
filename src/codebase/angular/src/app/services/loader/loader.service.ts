import { ComponentRef, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class LoaderService implements OnDestroy {
  private readonly _QUEUE$: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([]);
  private readonly _DESTROYED$: Subject<void> = new Subject<void>();
  private readonly _LOADING$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _OVERLAY_REF: OverlayRef;

  get isLoading(): Observable<boolean> {
    return this._LOADING$.asObservable().pipe(
      distinctUntilChanged(),
      tap((isLoading: boolean): void => {
        if (isLoading) {
          if (!this._OVERLAY_REF.hasAttached()) {
            const componentRef: ComponentRef<MatProgressSpinner> = this._OVERLAY_REF.attach(new ComponentPortal(MatProgressSpinner));
            componentRef.setInput('mode', 'indeterminate');
          }
        } else {
          this._OVERLAY_REF.detach();
        }
      })
    );
  }

  constructor(private _overlay: Overlay) {
    this._OVERLAY_REF = this._overlay.create({
      hasBackdrop: true,
      disposeOnNavigation: false,
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically()
    });

    this._QUEUE$
      .asObservable()
      .pipe(
        filter((queue: boolean[]): boolean => queue.length > 0 && queue[0]),
        tap((): void => {
          const updatedQueue: boolean[] = this._QUEUE$.value;
          updatedQueue[0] = false;
          this._QUEUE$.next(updatedQueue);
        }),
        takeUntil(this._DESTROYED$)
      )
      .subscribe();

    this.isLoading.subscribe();
  }

  ngOnDestroy(): void {
    this._QUEUE$.next([]);
    this._QUEUE$.complete();
    this._DESTROYED$.next();
    this._DESTROYED$.complete();
  }

  on(): void {
    this._addToQueue(true);
  }

  off(): void {
    this._removeDismissed();
  }

  private _addToQueue(isLoading: boolean): void {
    this._QUEUE$.next(this._QUEUE$.value.concat([isLoading]));
    this._LOADING$.next(Boolean(this._QUEUE$.value.length));
  }

  private _removeDismissed(): void {
    const updatedQueue: boolean[] = this._QUEUE$.value;
    if (!updatedQueue[0] && typeof updatedQueue[0] === 'boolean') {
      updatedQueue.shift();
    }
    this._QUEUE$.next(updatedQueue);
    this._LOADING$.next(Boolean(updatedQueue.length));
  }
}
