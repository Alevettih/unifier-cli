import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: ''
})
export abstract class BaseFormFieldComponent implements OnChanges, OnDestroy {
  private destroy: Subject<void> = new Subject<void>();
  @Input() icon: string;
  @Input() placeholder: string;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() appearance: 'legacy' | 'standard' | 'fill' | 'outline' = 'outline';
  @Input() value: any = null;
  @Input() control: AbstractControl = new FormControl();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges({ value, disabled, placeholder, control }: SimpleChanges): void {
    if (disabled && typeof disabled.currentValue === 'boolean') {
      if (this.disabled) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }

    if (control?.currentValue instanceof AbstractControl) {
      control.currentValue.valueChanges.pipe(takeUntil(this.destroy)).subscribe((): void => this.cdr.detectChanges());
    }

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  get errorMessage(): string {
    switch (true) {
      case this.control.hasError('mustMatch'):
        return 'Passwords do not match! Try again.';
      case this.control.hasError('required'):
        return 'This field is required.';
      case this.control.hasError('email'):
        return 'Incorrect email address.';
      case this.control.hasError('password'):
        return 'This field should have uppercase, lowercase, number and one non-word symbol.';
      default:
        return null;
    }
  }
}
