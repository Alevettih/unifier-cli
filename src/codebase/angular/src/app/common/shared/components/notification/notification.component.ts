import { Component } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  preserveWhitespaces: false
})
export class NotificationComponent extends Toast {
  constructor(protected _service: ToastrService, public _package: ToastPackage) {
    super(_service, _package);
  }
}
