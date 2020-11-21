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
  protected destroyed$: Subject<void> = new Subject<void>();
  @Input() icon: string;
  @Input() svgIcon: string;
  @Input() placeholder: string;
  @Input() label: string;
  @Input() id: string;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() value: string = '';
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() control: AbstractControl = new FormControl();
  @Input() floatLabel: FormFieldFloatLabelMode = FormFieldFloatLabelMode.never;
  @Input() maxLength: number = 255;
  @Input() autocomplete: string = 'off';

  constructor(protected cdr: ChangeDetectorRef, protected translate: TranslateService) {}

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
        .pipe(takeUntil(this.destroyed$))
        .subscribe((): void => this.cdr.detectChanges());
    }

    if (value) {
      this.control.setValue(value?.currentValue);
    }

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  get isRequired(): boolean {
    return Boolean(this.required);
  }

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  get errorMessage(): string {
    const mainTranslateKey: string = 'ERROR_MESSAGE';
    switch (true) {
      case this.control.hasError('mustMatch'):
        return this.translate.instant(`${mainTranslateKey}.MUST_MATCH`);
      case this.control.hasError('notUniqueValue'):
        return this.translate.instant(`${mainTranslateKey}.NOT_UNIQUE_VALUE`);
      case this.control.hasError('email'):
        return this.translate.instant(`${mainTranslateKey}.EMAIL`);
      case this.control.hasError('phone'):
        return this.translate.instant(`${mainTranslateKey}.PHONE`);
      case this.control.hasError('url'):
        return this.translate.instant(`${mainTranslateKey}.URL`);
      case this.control.hasError('min'):
        return this.translate.instant(`${mainTranslateKey}.MIN`, { value: this.control.getError('min').min });
      case this.control.hasError('max'):
        return this.translate.instant(`${mainTranslateKey}.MAX`, { value: this.control.getError('max').max });
      case this.control.hasError('minlength'):
        return this.translate.instant(`${mainTranslateKey}.MIN_LENGTH`, {
          value: this.control.getError('minlength')?.requiredLength
        });
      case this.control.hasError('maxlength'):
        return this.translate.instant(`${mainTranslateKey}.MAX_LENGTH`, {
          value: this.control.getError('maxlength')?.requiredLength
        });
      case this.control.hasError('password'):
        return this.translate.instant(`${mainTranslateKey}.PASSWORD`);
      case this.control.hasError('validName'):
        return this.translate.instant(`${mainTranslateKey}.VALID_NAME`);
      case this.control.hasError('lettersNumbersOnly'):
        return this.translate.instant(`${mainTranslateKey}.LETTERS_NUMBERS`);
      case this.control.hasError('required'):
        return this.translate.instant(`${mainTranslateKey}.REQUIRED`);
      case this.control.hasError('requiredTrue'):
        return this.translate.instant(`${mainTranslateKey}.REQUIRED`);
      default:
        return null;
    }
  }
}
