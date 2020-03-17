import { Component } from '@angular/core';
import { BaseFormFieldComponent } from '@misc/abstracts/base-form-field.component';

@Component({
  selector: 'base-checkbox',
  templateUrl: './base-checkbox.component.html',
  styleUrls: ['./base-checkbox.component.scss']
})
export class BaseCheckboxComponent extends BaseFormFieldComponent {}
