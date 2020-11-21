import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseFormFieldAbstractComponent } from '@misc/abstracts/base-form-field.abstract.component';

export enum BooleanFieldType {
  checkbox = 'checkbox',
  toggle = 'toggle'
}

@Component({
  selector: 'base-boolean-field',
  templateUrl: './base-boolean-field.component.html',
  styleUrls: ['./base-boolean-field.component.scss']
})
export class BaseBooleanFieldComponent extends BaseFormFieldAbstractComponent {
  readonly BooleanFieldType: typeof BooleanFieldType = BooleanFieldType;
  @Input() type: BooleanFieldType;
  @Input() title: string;
  @Input() stopPropagation: boolean;
  @Output() controlChange: EventEmitter<string> = new EventEmitter();
  isLinkElement: boolean = false;

  stopCheckboxEvent(event: any): void {
    if (this.stopPropagation) {
      event.stopPropagation();
    }
    if (event.type === 'input') {
      this.controlChange.emit('');
    }
  }

  focusOut(): void {
    if (this.isLinkElement) {
      this.control.markAsUntouched();
    }
  }

  clickCheckbox(event: MouseEvent): void {
    const target: HTMLLinkElement = event.target as HTMLLinkElement;
    const isLink: boolean = !!target.closest('a');
    this.isLinkElement = isLink;

    if (isLink) {
      event.stopPropagation();
    }
  }
}
