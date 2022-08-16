import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseFormFieldAbstractComponent } from '@misc/abstracts/base-form-field.abstract.component';
import { InputType } from '@models/enums/input-type.enum';

@Component({
  selector: 'base-form-input',
  templateUrl: './base-input.component.html',
  styleUrls: ['./base-input.component.scss']
})
export class BaseInputComponent extends BaseFormFieldAbstractComponent {
  private _shouldRevealPassword: boolean = false;
  @Input() inputType: InputType;
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  get isSearchInput(): boolean {
    return this.inputType === InputType.search;
  }

  get isPasswordInput(): boolean {
    return this.inputType === InputType.password;
  }

  get buttonIcon(): string {
    return this._shouldRevealPassword ? 'visibility_off' : 'visibility';
  }

  get type(): string {
    switch (this.inputType) {
      case InputType.password:
        return this._shouldRevealPassword ? InputType.text : InputType.password;
      default:
        return this.inputType;
    }
  }

  onEnter(event: Event): void {
    if (this.isSearchInput) {
      event.preventDefault();
      this.search.emit(this.formControl.value);
    }
  }

  togglePassword(): void {
    this._shouldRevealPassword = !this._shouldRevealPassword;
  }
}
