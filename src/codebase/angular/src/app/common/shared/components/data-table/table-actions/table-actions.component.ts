import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core/common-behaviors/color';

export interface IAction {
  name: string;
  value: string;
  icon: string;
  color?: ThemePalette;
}

@Component({
  selector: 'table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss']
})
export class TableActionsComponent {
  @Input() actions: IAction[];
  @Output() actionClick: EventEmitter<string> = new EventEmitter<string>();
}
