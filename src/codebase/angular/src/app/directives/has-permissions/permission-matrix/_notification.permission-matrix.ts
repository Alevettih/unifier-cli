import { IPermissionMatrix } from '@directives/has-permissions/permission-matrix/index';
import { UserRole } from '@models/enums/user-role.enum';

export type notificationsPermissionType = 'notifications_view';

export const notificationPermissionMatrix: IPermissionMatrix<notificationsPermissionType> = {
  notifications_view: [UserRole.client, UserRole.admin]
};
