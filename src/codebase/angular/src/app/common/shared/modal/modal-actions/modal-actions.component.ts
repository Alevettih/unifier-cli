import { Component, Input } from '@angular/core';
import { IAction } from '@shared/components/data-table/table-actions/table-actions.component';

export interface IModalAction<T> extends IAction<T> {
  type: 'submit' | 'close';
}

@Component({
  selector: 'modal-actions',
  templateUrl: './modal-actions.component.html',
  styleUrls: ['./modal-actions.component.scss']
})
export class ModalActionsComponent<T> {
  @Input() actions: IModalAction<T>[];
}
