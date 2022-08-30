import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { TranslateService } from '@ngx-translate/core';

export enum FormFieldFloatLabelMode {
  auto = 'auto',
  always = 'always',
  never = 'never'
}

@Component({
  template: ''
})
export abstract class BaseFormFieldAbstractComponent implements OnChanges, OnDestroy {
  @Input() icon: string;
  @Input() customRequiredKey: string;
  @Input() placeholder: string;
  @Input() id: string;
  @Input() value: any;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() control: AbstractControl = new FormControl();
  @Input() floatLabel: FormFieldFloatLabelMode = FormFieldFloatLabelMode.never;
  @Input() maxLength: number = 256;
  @Input() autocomplete: string = 'off';
  protected readonly _DESTROYED$: Subject<void> = new Subject<void>();

  get isRequired(): boolean {
    return Boolean(this.required);
  }

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  get errorMessage(): string {
    const mainTranslateKey: string = 'ERROR_MESSAGE';
    const fieldName: string = this.placeholder;

    switch (true) {
      case this.control.hasError('mustMatch'):
        return this._translate.instant(`${mainTranslateKey}.MUST_MATCH`);
      case this.control.hasError('notUniqueValue'):
        return this._translate.instant(`${mainTranslateKey}.NOT_UNIQUE_VALUE`);
      case this.control.hasError('email'):
        return this._translate.instant(`${mainTranslateKey}.EMAIL`);
      case this.control.hasError('phone'):
        return this._translate.instant(`${mainTranslateKey}.PHONE`);
      case this.control.hasError('url'):
        return this._translate.instant(`${mainTranslateKey}.URL`);
      case this.control.hasError('min'):
        return this._translate.instant(`${mainTranslateKey}.MIN`, { value: this.control.getError('min').min });
      case this.control.hasError('max'):
        return this._translate.instant(`${mainTranslateKey}.MAX`, { value: this.control.getError('max').max });
      case this.control.hasError('minlength'):
        return this._translate.instant(`${mainTranslateKey}.MIN_LENGTH`, {
          value: this.control.getError('minlength')?.requiredLength
        });
      case this.control.hasError('maxlength'):
        return this._translate.instant(`${mainTranslateKey}.MAX_LENGTH`, {
          value: this.control.getError('maxlength')?.requiredLength
        });
      case this.control.hasError('password'):
        return this._translate.instant(`${mainTranslateKey}.PASSWORD`);
      case this.control.hasError('validName'):
        return this._translate.instant(`${mainTranslateKey}.VALID_NAME`);
      case this.control.hasError('lettersNumbersOnly'):
        return this._translate.instant(`${mainTranslateKey}.LETTERS_NUMBERS`);
      case this.control.hasError('required'):
        return this._translate.instant(`${mainTranslateKey}.${this.customRequiredKey ?? 'REQUIRED'}`, {
          fieldName: this.customRequiredKey ? fieldName.toLowerCase() : fieldName
        });
      case this.control.hasError('requiredTrue'):
        return this._translate.instant(`${mainTranslateKey}.${this.customRequiredKey ?? 'REQUIRED'}`, {
          fieldName: this.customRequiredKey ? fieldName.toLowerCase() : fieldName
        });
      default:
        return null;
    }
  }

  constructor(protected _cdr: ChangeDetectorRef, protected _translate: TranslateService) {}

  ngOnDestroy(): void {
    this._DESTROYED$.next();
    this._DESTROYED$.complete();
  }

  ngOnChanges({ value, disabled, placeholder, control }: SimpleChanges): void {
    if (disabled && typeof disabled.currentValue === 'boolean') {
      if (this.disabled) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }

    if (control?.currentValue instanceof AbstractControl) {
      zip(control.currentValue.valueChanges, control.currentValue.statusChanges)
        .pipe(takeUntil(this._DESTROYED$))
        .subscribe((): void => this._cdr.detectChanges());
    }

    if (value) {
      this.control.setValue(value?.currentValue);
    }

    this._cdr.detectChanges();
  }
}
