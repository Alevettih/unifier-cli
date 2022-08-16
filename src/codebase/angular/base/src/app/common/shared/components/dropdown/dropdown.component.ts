import { Component, Input } from '@angular/core';
import { IDropdownItem } from '@models/interfaces/dropdown-item.interface';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() items: IDropdownItem<any>[] = [];
  @Input() iconName: string;
  @Input() panelClass: string;
  @Input() isTranslateY: boolean = false;
}
