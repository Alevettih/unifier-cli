import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay, filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { SnackBarNotificationType } from '@models/enums/snack-bar-notification-type.enum';
import { ISnackBarQueueItem } from '@models/interfaces/snack-bar-queue-item.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private readonly queue: BehaviorSubject<ISnackBarQueueItem[]> = new BehaviorSubject<ISnackBarQueueItem[]>([]);
  private readonly queue$: Observable<ISnackBarQueueItem[]> = this.queue.asObservable();
  private readonly ngDestroy: Subject<void> = new Subject();
  private readonly config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {
    this.queue$
      .pipe(
        filter((queue: ISnackBarQueueItem[]): boolean => queue.length > 0 && !queue[0].beingDispatched),
        tap((): void => {
          const updatedQueue: ISnackBarQueueItem[] = this.queue.value;
          updatedQueue[0].beingDispatched = true;
          this.queue.next(updatedQueue);
        }),
        map((queue: ISnackBarQueueItem[]): ISnackBarQueueItem => queue[0]),
        takeUntil(this.ngDestroy)
      )
      .subscribe((snackBarItem: ISnackBarQueueItem): void =>
        this.show(snackBarItem.message, snackBarItem.messageType, snackBarItem.configParams)
      );
  }

  ngOnDestroy(): void {
    this.queue.next([]);
    this.queue.complete();
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  addToQueue(message: string, messageType: SnackBarNotificationType, configParams?: MatSnackBarConfig): void {
    this.queue.next(this.queue.value.concat([{ message, messageType, configParams, beingDispatched: false }]));
  }

  private removeDismissedSnackBar(dismissed: Observable<MatSnackBarDismiss>): void {
    dismissed.pipe(delay(300), take(1)).subscribe((): void => {
      const updatedQueue: ISnackBarQueueItem[] = this.queue.value;
      if (updatedQueue[0]?.beingDispatched) {
        updatedQueue.shift();
      }
      this.queue.next(updatedQueue);
    });
  }

  show(message: string, type?: SnackBarNotificationType, config?: MatSnackBarConfig): void {
    this.removeDismissedSnackBar(
      this.snackBar.open(message, 'OK', Object.assign(this.config, config, { panelClass: type })).afterDismissed()
    );
  }
}
