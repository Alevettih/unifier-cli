import { FormControl } from '@angular/forms';
import { InputType } from '@models/enums/input-type.enum';
import { IOption } from '@models/interfaces/forms/option.interface';
import { FormControlItemType } from '@models/enums/form-control-item.type';
import { BooleanFieldType } from '@forms/base-boolean-field/base-boolean-field.component';
import { FileType } from '@models/enums/file-type.enum';

export interface IFormControlItem {
  name: string;
  customRequiredKey?: string;
  placeholder: string;
  control: FormControl;
  controlType: FormControlItemType;
  icon?: string;
  options?: IOption[];
  inputType?: InputType | BooleanFieldType;
  fileType?: FileType[];
  readonly?: boolean;
  required?: boolean;
}
