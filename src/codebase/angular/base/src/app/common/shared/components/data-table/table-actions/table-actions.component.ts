import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

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
export class TableActionsComponent<T = string> {
  @Input() actions: IAction<T>[];
  @Output() actionClick: EventEmitter<T> = new EventEmitter<T>();
}
