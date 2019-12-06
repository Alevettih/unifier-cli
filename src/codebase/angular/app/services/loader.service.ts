import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoaderService implements OnDestroy {
  private readonly queue = new BehaviorSubject<boolean[]>([]);
  private readonly ngDestroy = new Subject();
  private loading = new BehaviorSubject<boolean>(false);

  constructor() {
    this.queue
      .asObservable()
      .pipe(
        filter(queue => queue.length > 0 && queue[0]),
        tap(() => {
          const updatedQueue = this.queue.value;
          updatedQueue[0] = false;
          this.queue.next(updatedQueue);
        }),
        takeUntil(this.ngDestroy)
      )
      .subscribe(() => {});
  }

  ngOnDestroy() {
    this.queue.next([]);
    this.queue.complete();
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  on(): void {
    this.addToQueue(true);
  }

  off(): void {
    this.removeDismissed();
  }

  private addToQueue(loading: boolean) {
    this.queue.next(this.queue.value.concat([loading]));
    this.loading.next(Boolean(this.queue.value.length));
  }

  private removeDismissed() {
    const updatedQueue = this.queue.value;
    if (!updatedQueue[0] && typeof updatedQueue[0] === 'boolean') {
      updatedQueue.shift();
    }
    this.queue.next(updatedQueue);
    this.loading.next(Boolean(updatedQueue.length));
  }

  get isLoading(): Observable<boolean> {
    return this.loading.asObservable().pipe(distinctUntilChanged());
  }
}
