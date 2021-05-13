import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseFormAbstractComponent } from '@misc/abstracts/base-form.abstract.component';
import { IFormModalData } from '@models/interfaces/modals/form-modal-data.interface';
import { FormBuilder } from '@angular/forms';
import { IFormControlItem } from '@models/interfaces/forms/form-control-item.interface';
import { BooleanFieldType } from '@forms/base-boolean-field/base-boolean-field.component';
import { InputType } from '@models/enums/input-type.enum';
import { FormControlItemType } from '@models/enums/form-control-item.type';
import { FileType } from '@models/enums/file-type.enum';

@Component({
  selector: 'form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent extends BaseFormAbstractComponent implements OnInit {
  readonly FileType: typeof FileType = FileType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IFormModalData,
    private fb: FormBuilder,
    private dialog: MatDialogRef<FormModalComponent>
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({});
    this.setControlsArray(this.data.inputs);
  }

  get inputs(): IFormControlItem[] {
    return this.data.inputs;
  }

  get declineName(): string {
    return this.data?.buttonsNames?.decline ?? 'BUTTON_NAME.CLOSE';
  }

  get approveName(): string {
    return this.data?.buttonsNames?.approve ?? 'BUTTON_NAME.ACCEPT';
  }

  getRightType(type: InputType | BooleanFieldType, controlType: FormControlItemType): any {
    if (controlType === FormControlItemType.input) {
      return type as InputType;
    }

    if (controlType === FormControlItemType.boolean) {
      return type as BooleanFieldType;
    }

    return type as any;
  }

  getFormValue(): any {
    return this.data.getRawValue(this.formGroup.getRawValue());
  }

  ngSubmit(): void {
    for (const input in this.form) {
      if (this.form.hasOwnProperty(input)) {
        this.form[input].markAsTouched();
      }
    }

    if (this.formGroup.invalid) {
      return;
    }

    this.dialog.close(this.getFormValue());
  }
}
