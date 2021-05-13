import { Component, Input } from '@angular/core';
import { IDropdownItem } from '@models/interfaces/dropdown-item.interface';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() items: IDropdownItem<any>[] = [];
  @Input() isActive: boolean = false;
  @Input() disablePadding: boolean = false;
  @Input() isDivider: boolean = true;
  @Input() iconName: string;
  @Input() panelClass: string;
  @Input() isTranslateY: boolean = false;
}
