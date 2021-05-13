import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageModalType } from '@models/enums/message-modal-type.enum';
import { IMessageModalData } from '@models/interfaces/modals/message-modal-data.interface';

@Component({
  selector: 'message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IMessageModalData) {}

  get isConfirmModal(): boolean {
    return (this.data.type ?? MessageModalType.alert) === MessageModalType.confirm;
  }

  get isAlertModal(): boolean {
    return (this.data.type ?? MessageModalType.alert) === MessageModalType.alert;
  }

  get declineName(): string {
    return this.data?.buttonsNames?.decline ?? 'BUTTON_NAME.CLOSE';
  }

  get approveName(): string {
    return this.data?.buttonsNames?.approve ?? 'BUTTON_NAME.ACCEPT';
  }
}
