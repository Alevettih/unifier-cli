import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static password({ value }: AbstractControl): ValidationErrors | null {
    const isContainNumber = /\d/gm.test(value);
    const isContainUppercase = /[A-Z]/gm.test(value);
    const isContainLowercase = /[a-z]/gm.test(value);
    const valid = isContainNumber && isContainUppercase && isContainLowercase;

    return valid || value === '' ? null : { password: { valid: false, value } };
  }

  static mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

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
