import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay, filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { SnackBarNotificationType } from '@models/enums/snack-bar-notification-type.enum';
import { ISnackBarQueueItem } from '@models/interfaces/snack-bar-queue-item.interface';
import { INotificationData, NotificationComponent } from '@shared/components/notification/notification.component';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private _snackBar: MatSnackBar, private _translate: TranslateService, private _ngZone: NgZone) {
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
        this.show(snackBarItem.data, snackBarItem.messageType, snackBarItem.configParams)
      );
  }

  ngOnDestroy(): void {
    this._queue.next([]);
    this._queue.complete();
    this._ngDestroy.next();
    this._ngDestroy.complete();
  }

  addToQueue(data: INotificationData, messageType?: SnackBarNotificationType, configParams?: MatSnackBarConfig): void {
    this._queue.next(
      this._queue.value.concat([
        {
          data: { heading: this._translate.instant(`CUSTOM_NOTIFICATIONS.${(messageType ?? '').toUpperCase() ?? 'HELLO'}`), ...data },
          messageType,
          configParams,
          beingDispatched: false
        }
      ])
    );
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

  show(data: INotificationData, type?: SnackBarNotificationType, config?: MatSnackBarConfig): void {
    this._removeDismissedSnackBar(
      this._ngZone.run(() =>
        this._snackBar
          .openFromComponent(NotificationComponent, Object.assign({ ...this._config, ...config }, { panelClass: type, data }))
          .afterDismissed()
      )
    );
  }
}
