import { AbstractControl, FormGroup } from '@angular/forms';

export interface FormControls {
  [key: string]: AbstractControl;
}

export abstract class BaseForm {
  formGroup: FormGroup;

  get form(): FormControls {
    return this.formGroup.controls;
  }
}
