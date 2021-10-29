import { SnackBarNotificationType } from '@models/enums/snack-bar-notification-type.enum';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { INotificationData } from '@shared/components/notification/notification.component';

export interface ISnackBarQueueItem {
  data: INotificationData;
  messageType: SnackBarNotificationType;
  beingDispatched: boolean;
  configParams?: MatSnackBarConfig;
}
