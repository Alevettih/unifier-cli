import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormAbstractComponent } from '@misc/abstracts/base-form.abstract.component';
import { MessageModalType } from '@models/enums/message-modal-type.enum';

export interface IMessageModalData {
  title?: string;
  message?: string;
  type?: MessageModalType;
  buttonsNames?: {
    approve: string;
    decline: string;
  };
}

@Component({
  selector: 'message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent extends BaseFormAbstractComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IMessageModalData) {
    super();
  }

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
