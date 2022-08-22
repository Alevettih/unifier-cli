import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAction } from '@shared/components/data-table/table-actions/table-actions.component';

export interface IModalAction extends Omit<IAction<boolean>, 'value'> {
  type: 'submit' | 'close';
  value?: boolean;
}

@Component({
  selector: 'modal-actions',
  templateUrl: './modal-actions.component.html',
  styleUrls: ['./modal-actions.component.scss']
})
export class ModalActionsComponent {
  @Input() actions: IModalAction[];
  @Output() submitted: EventEmitter<void> = new EventEmitter<void>();
}
