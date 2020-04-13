import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static password({ value }: AbstractControl): ValidationErrors | null {
    const isContainNumber: boolean = /\d/gm.test(value);
    const isContainUppercase: boolean = /[A-Z]/gm.test(value);
    const isContainLowercase: boolean = /[a-z]/gm.test(value);
    const valid: boolean = isContainNumber && isContainUppercase && isContainLowercase;

    return valid || value === '' ? null : { password: { valid: false, value } };
  }

  static mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const control: AbstractControl = formGroup.controls[controlName];
      const matchingControl: AbstractControl = formGroup.controls[matchingControlName];

      if (!control.value && matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({
          mustMatch: {
            controlName,
            matchingControlName
          }
        });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
