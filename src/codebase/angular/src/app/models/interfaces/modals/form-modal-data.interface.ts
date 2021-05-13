import { IBaseModalData } from '@models/interfaces/modals/_base.interface';
import { IFormControlItem } from '@models/interfaces/forms/form-control-item.interface';

export interface IFormModalData extends IBaseModalData {
  inputs: IFormControlItem[];
  getRawValue: (formValue: any) => any;
}
