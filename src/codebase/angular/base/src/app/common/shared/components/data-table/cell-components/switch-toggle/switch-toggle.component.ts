import { Component, Input, OnInit } from '@angular/core';
import { BooleanFieldType } from '@forms/base-boolean-field/base-boolean-field.component';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'switch-toggle',
  templateUrl: './switch-toggle.component.html',
  styleUrls: ['./switch-toggle.component.scss']
})
export class SwitchToggleComponent implements OnInit {
  @Input() value: boolean;
  control: FormControl;
  readonly BooleanFieldType: typeof BooleanFieldType = BooleanFieldType;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.control = this._fb.control(this.value ?? false);
  }
}
