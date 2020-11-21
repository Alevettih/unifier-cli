import { SnackBarNotificationType } from '@models/enums/snack-bar-notification-type.enum';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

export interface ISnackBarQueueItem {
  message: string;
  messageType: SnackBarNotificationType;
  beingDispatched: boolean;
  configParams?: MatSnackBarConfig;
}
