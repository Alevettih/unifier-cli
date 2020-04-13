import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay, filter, map, take, takeUntil, tap } from 'rxjs/operators';

export enum NotificationType {
  error = 'error',
  success = 'success'
}

export interface SnackBarQueueItem {
  message: string;
  messageType: NotificationType;
  beingDispatched: boolean;
  configParams?: MatSnackBarConfig;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private readonly queue: BehaviorSubject<SnackBarQueueItem[]> = new BehaviorSubject<SnackBarQueueItem[]>([]);
  private readonly queue$: Observable<SnackBarQueueItem[]> = this.queue.asObservable();
  private readonly ngDestroy: Subject<void> = new Subject();
  private readonly config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {
    this.queue$
      .pipe(
        filter((queue: SnackBarQueueItem[]): boolean => queue.length > 0 && !queue[0].beingDispatched),
        tap((): void => {
          const updatedQueue: SnackBarQueueItem[] = this.queue.value;
          updatedQueue[0].beingDispatched = true;
          this.queue.next(updatedQueue);
        }),
        map((queue: SnackBarQueueItem[]): SnackBarQueueItem => queue[0]),
        takeUntil(this.ngDestroy)
      )
      .subscribe((snackBarItem: SnackBarQueueItem): void =>
        this.show(snackBarItem.message, snackBarItem.messageType, snackBarItem.configParams)
      );
  }

  ngOnDestroy(): void {
    this.queue.next([]);
    this.queue.complete();
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  addToQueue(message: string, messageType: NotificationType, configParams?: MatSnackBarConfig): void {
    this.queue.next(this.queue.value.concat([{ message, messageType, configParams, beingDispatched: false }]));
  }

  /* Remove dismissed snack bar from queue and triggers another one to appear */
  private removeDismissedSnackBar(dismissed: Observable<MatSnackBarDismiss>): void {
    dismissed.pipe(delay(300), take(1)).subscribe((): void => {
      const updatedQueue: SnackBarQueueItem[] = this.queue.value;
      if (updatedQueue[0]?.beingDispatched) {
        updatedQueue.shift();
      }
      this.queue.next(updatedQueue);
    });
  }

  show(message: string, type?: NotificationType, config?: MatSnackBarConfig): void {
    this.removeDismissedSnackBar(
      this.snackBar.open(message, 'OK', Object.assign(this.config, config, { panelClass: type })).afterDismissed()
    );
  }
}
