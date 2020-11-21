import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { InputType } from '@models/enums/input-type.enum';
import { IFormControlItem } from '@models/interfaces/forms/form-control-item.interface';

export interface IFormControls {
  [key: string]: AbstractControl;
}

@Component({
  template: ''
})
export abstract class BaseFormAbstractComponent implements OnDestroy {
  protected readonly destroyed$: Subject<void> = new Subject();
  readonly InputType: typeof InputType = InputType;
  formGroup: FormGroup;

  get form(): IFormControls {
    return this.formGroup.controls;
  }

  getGroup(name: string): FormGroup {
    return this.getItemFormGroup(name) as FormGroup;
  }

  getControl(name: string): FormControl {
    return this.getItemFormGroup(name) as FormControl;
  }

  getArray(name: string): FormArray {
    return this.getItemFormGroup(name) as FormArray;
  }

  private getItemFormGroup(name: string): AbstractControl {
    return this.formGroup.get(name);
  }

  public setControlsArray(formControls: IFormControlItem[]): void {
    if (!formControls.length) {
      return;
    }

    formControls.forEach((itemControl: IFormControlItem): void => this.formGroup.addControl(itemControl.name, itemControl.control));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
