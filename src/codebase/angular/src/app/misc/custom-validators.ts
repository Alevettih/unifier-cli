import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserApiService } from '@services/api/user-api/user-api.service';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

export class CustomValidators {
  static password({ value }: AbstractControl): ValidationErrors | null {
    const isValid: boolean = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,30}$/iu.test(value);

    return isValid || value === '' ? null : { password: { valid: false, value } };
  }

  static phone({ value }: AbstractControl): ValidationErrors | null {
    return /^[+]?[0-9]{1,4}[0-9]{7,10}$/gm.test(value) || !value ? null : { phone: true };
  }

  static url({ value }: AbstractControl): ValidationErrors | null {
    const isValid: boolean = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\/?#\[\]@!$&'()*+,;=]+$/gm.test(value);
    return isValid || !value ? null : { url: true };
  }

  static validName({ value }: AbstractControl): ValidationErrors | null {
    const isValid: boolean = /^(\S+ ?)+/gu.test(value);
    return isValid || value === '' ? null : { validName: { valid: false, value } };
  }

  static fullEmail({ value }: AbstractControl): ValidationErrors | null {
    const isValid: boolean = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(value);

    return isValid || value === '' ? null : { email: { valid: false, value } };
  }

  static lettersNumbersOnly({ value }: AbstractControl): ValidationErrors | null {
    const isValid: boolean = /^[a-zA-Z0-9-]+$/.test(value);

    return isValid || value === '' ? null : { lettersNumbersOnly: { valid: false, value } };
  }

  static mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const group: FormGroup = formGroup as FormGroup;
      const control: AbstractControl = group.controls[controlName];
      const matchingControl: AbstractControl = group.controls[matchingControlName];

      if (!control.value && matchingControl.errors && !matchingControl.errors.mustMatch) {
        return null;
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

      return null;
    };
  }

  static isUniqueValue(userApi: UserApiService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return userApi.availableEmail(control.value, { skipErrorNotification: true, skipLoaderStart: true }).pipe(
        take(1),
        map((): null => null),
        catchError((): Observable<ValidationErrors> => of({ notUniqueValue: true }))
      );
    };
  }
}
