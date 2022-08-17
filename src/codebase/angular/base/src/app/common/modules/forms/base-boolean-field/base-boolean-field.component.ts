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
  @Input() type: BooleanFieldType;
  @Output() controlChange: EventEmitter<any> = new EventEmitter<any>();
  readonly BooleanFieldType: typeof BooleanFieldType = BooleanFieldType;
}
