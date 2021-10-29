import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core/common-behaviors/color';

export interface IAction<T = string> {
  name: string;
  value: T;
  icon?: string;
  color?: ThemePalette;
  disabled?: boolean;
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
