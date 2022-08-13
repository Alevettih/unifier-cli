import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export interface INotificationData {
  heading?: string;
  message: string;
  image?: string;
  url?: string;
}

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: INotificationData, private _snackBar: MatSnackBarRef<NotificationComponent>) {}

  close(): void {
    this._snackBar.dismiss();
  }

  get image(): string {
    return this.data?.image ?? '/assets/img/logo.png';
  }
}
