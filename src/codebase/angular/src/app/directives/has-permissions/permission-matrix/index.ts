import { UserRole } from '@models/enums/user-role.enum';
import { profilePermissionMatrix, profilePermissionType } from '@directives/has-permissions/permission-matrix/_profile.permission-matrix';
import {
  notificationPermissionMatrix,
  notificationsPermissionType
} from '@directives/has-permissions/permission-matrix/_notification.permission-matrix';

export type permissionType = profilePermissionType | notificationsPermissionType;

export type CRUDPermissionType<T extends string> = `${T}_view` | `${T}_create` | `${T}_edit` | `${T}_delete`;
export type IPermissionMatrix<T extends string> = Record<T, UserRole[]>;

export const permissionMatrix: IPermissionMatrix<permissionType> = {
  ...profilePermissionMatrix,
  ...notificationPermissionMatrix
};
