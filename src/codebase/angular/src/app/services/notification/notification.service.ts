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
  private readonly _queue: BehaviorSubject<ISnackBarQueueItem[]> = new BehaviorSubject<ISnackBarQueueItem[]>([]);
  private readonly _queue$: Observable<ISnackBarQueueItem[]> = this._queue.asObservable();
  private readonly _ngDestroy: Subject<void> = new Subject();
  private readonly _config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  constructor(private _snackBar: MatSnackBar) {
    this._queue$
      .pipe(
        filter((queue: ISnackBarQueueItem[]): boolean => queue.length > 0 && !queue[0].beingDispatched),
        tap((): void => {
          const updatedQueue: ISnackBarQueueItem[] = this._queue.value;
          updatedQueue[0].beingDispatched = true;
          this._queue.next(updatedQueue);
        }),
        map((queue: ISnackBarQueueItem[]): ISnackBarQueueItem => queue[0]),
        takeUntil(this._ngDestroy)
      )
      .subscribe((snackBarItem: ISnackBarQueueItem): void =>
        this.show(snackBarItem.message, snackBarItem.messageType, snackBarItem.configParams)
      );
  }

  ngOnDestroy(): void {
    this._queue.next([]);
    this._queue.complete();
    this._ngDestroy.next();
    this._ngDestroy.complete();
  }

  addToQueue(message: string, messageType: SnackBarNotificationType, configParams?: MatSnackBarConfig): void {
    this._queue.next(this._queue.value.concat([{ message, messageType, configParams, beingDispatched: false }]));
  }

  private _removeDismissedSnackBar(dismissed: Observable<MatSnackBarDismiss>): void {
    dismissed.pipe(delay(300), take(1)).subscribe((): void => {
      const updatedQueue: ISnackBarQueueItem[] = this._queue.value;
      if (updatedQueue[0]?.beingDispatched) {
        updatedQueue.shift();
      }
      this._queue.next(updatedQueue);
    });
  }

  show(message: string, type?: SnackBarNotificationType, config?: MatSnackBarConfig): void {
    this._removeDismissedSnackBar(
      this._snackBar.open(message, 'OK', Object.assign(this._config, config, { panelClass: type })).afterDismissed()
    );
  }
}
