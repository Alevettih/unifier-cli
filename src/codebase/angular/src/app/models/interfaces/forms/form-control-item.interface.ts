import { FormControl } from '@angular/forms';
import { InputType } from '@models/enums/input-type.enum';
import { IOption } from '@models/interfaces/forms/option.interface';

export interface IFormControlItem {
  name: string;
  placeholder: string;
  control: FormControl;
  icon?: string;
  options?: IOption[];
  type?: InputType;
  readonly?: boolean;
  required?: boolean;
}
