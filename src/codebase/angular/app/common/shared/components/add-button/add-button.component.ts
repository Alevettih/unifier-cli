import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {
  @Output() add: EventEmitter<void> = new EventEmitter<void>();
  @Input() iconSize: string;

  constructor() {}

  onClick(): void {
    this.add.emit();
  }
}
