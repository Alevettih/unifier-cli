import { Component, Input } from '@angular/core';
import { BaseFormFieldAbstractComponent } from '@misc/abstracts/base-form-field.abstract.component';
import { InputType } from '@models/enums/input-type.enum';

@Component({
  selector: 'base-form-input',
  templateUrl: './base-input.component.html',
  styleUrls: ['./base-input.component.scss']
})
export class BaseInputComponent extends BaseFormFieldAbstractComponent {
  private revealPassword: boolean = false;
  @Input() inputType: InputType;

  get isButtonShown(): boolean {
    return this.inputType === InputType.password;
  }

  get buttonIcon(): string {
    return this.revealPassword ? 'visibility_off' : 'visibility';
  }

  get type(): string {
    switch (this.inputType) {
      case InputType.password:
        return this.revealPassword ? InputType.text : InputType.password;
      default:
        return this.inputType;
    }
  }

  togglePassword(): void {
    this.revealPassword = !this.revealPassword;
  }
}
