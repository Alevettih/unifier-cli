import { MessageModalType } from '@models/enums/message-modal-type.enum';
import { IBaseModalData } from '@models/interfaces/modals/_base.interface';

export interface IMessageModalData extends IBaseModalData {
  message?: string;
  type?: MessageModalType;
}
