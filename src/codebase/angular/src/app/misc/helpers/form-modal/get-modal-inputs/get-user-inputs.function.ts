import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IFormControlItem } from '@models/interfaces/forms/form-control-item.interface';
import { FormControlItemType } from '@models/enums/form-control-item.type';
import { User } from '@models/classes/user.model';

export function getUserInputs(fb: FormBuilder, translate: TranslateService): (entity?: User) => IFormControlItem[] {
  return (entity: User): IFormControlItem[] => [
    {
      name: 'firstName',
      placeholder: translate.instant('INPUT_NAME.FIRST_NAME'),
      control: fb.control(entity?.firstName, Validators.required),
      controlType: FormControlItemType.input
    },
    {
      name: 'lastName',
      placeholder: translate.instant('INPUT_NAME.LAST_NAME'),
      control: fb.control(entity?.lastName, Validators.required),
      controlType: FormControlItemType.input
    }
  ];
}
