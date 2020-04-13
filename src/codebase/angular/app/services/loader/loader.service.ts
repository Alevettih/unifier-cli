import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoaderService implements OnDestroy {
  private readonly queue: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([]);
  private readonly ngDestroy: Subject<void> = new Subject<void>();
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.queue
      .asObservable()
      .pipe(
        filter((queue: boolean[]): boolean => queue.length > 0 && queue[0]),
        tap((): void => {
          const updatedQueue: boolean[] = this.queue.value;
          updatedQueue[0] = false;
          this.queue.next(updatedQueue);
        }),
        takeUntil(this.ngDestroy)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
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

  private addToQueue(loading: boolean): void {
    this.queue.next(this.queue.value.concat([loading]));
    this.loading.next(Boolean(this.queue.value.length));
  }

  private removeDismissed(): void {
    const updatedQueue: boolean[] = this.queue.value;
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
