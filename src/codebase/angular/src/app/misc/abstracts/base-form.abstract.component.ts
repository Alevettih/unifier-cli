import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { InputType } from '@models/enums/input-type.enum';
import { IFormControlItem } from '@models/interfaces/forms/form-control-item.interface';
import { FormControlItemType } from '@models/enums/form-control-item.type';

export interface IFormControls {
  [key: string]: AbstractControl;
}

@Component({
  template: ''
})
export abstract class BaseFormAbstractComponent implements OnDestroy {
  formGroup: FormGroup;
  readonly FormControlItemType: typeof FormControlItemType = FormControlItemType;
  readonly InputType: typeof InputType = InputType;
  protected readonly _DESTROYED$: Subject<void> = new Subject();

  get form(): IFormControls {
    return this.formGroup?.controls;
  }

  ngOnDestroy(): void {
    this._DESTROYED$.next();
    this._DESTROYED$.complete();
  }

  getGroup(name: string): FormGroup {
    return this._getItemFormGroup(name) as FormGroup;
  }

  getControl(name: string): FormControl {
    return this._getItemFormGroup(name) as FormControl;
  }

  getArray(name: string): FormArray {
    return this._getItemFormGroup(name) as FormArray;
  }

  setControlsArray(formControls: IFormControlItem[]): void {
    if (!formControls.length) {
      return;
    }

    formControls.forEach((itemControl: IFormControlItem): void => this.formGroup.addControl(itemControl.name, itemControl.control));
  }

  private _getItemFormGroup(name: string): AbstractControl {
    return this.formGroup.get(name);
  }
}
