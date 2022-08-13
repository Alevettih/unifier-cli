import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatSpinner } from '@angular/material/progress-spinner';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class LoaderService implements OnDestroy {
  private readonly _queue: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([]);
  private readonly _ngDestroy: Subject<void> = new Subject<void>();
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _overlayRef: OverlayRef;

  constructor(private _overlay: Overlay) {
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      disposeOnNavigation: false,
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically()
    });

    this._queue
      .asObservable()
      .pipe(
        filter((queue: boolean[]): boolean => queue.length > 0 && queue[0]),
        tap((): void => {
          const updatedQueue: boolean[] = this._queue.value;
          updatedQueue[0] = false;
          this._queue.next(updatedQueue);
        }),
        takeUntil(this._ngDestroy)
      )
      .subscribe();

    this.isLoading.subscribe();
  }

  ngOnDestroy(): void {
    this._queue.next([]);
    this._queue.complete();
    this._ngDestroy.next();
    this._ngDestroy.complete();
  }

  on(): void {
    this._addToQueue(true);
  }

  off(): void {
    this._removeDismissed();
  }

  private _addToQueue(loading: boolean): void {
    this._queue.next(this._queue.value.concat([loading]));
    this._loading.next(Boolean(this._queue.value.length));
  }

  private _removeDismissed(): void {
    const updatedQueue: boolean[] = this._queue.value;
    if (!updatedQueue[0] && typeof updatedQueue[0] === 'boolean') {
      updatedQueue.shift();
    }
    this._queue.next(updatedQueue);
    this._loading.next(Boolean(updatedQueue.length));
  }

  get isLoading(): Observable<boolean> {
    return this._loading.asObservable().pipe(
      distinctUntilChanged(),
      tap((isLoading: boolean): void => {
        if (isLoading) {
          if (!this._overlayRef.hasAttached()) {
            this._overlayRef.attach(new ComponentPortal(MatSpinner));
          }
        } else {
          this._overlayRef.detach();
        }
      })
    );
  }
}
