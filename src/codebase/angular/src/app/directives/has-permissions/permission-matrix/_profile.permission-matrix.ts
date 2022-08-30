import { IPermissionMatrix } from '@directives/has-permissions/permission-matrix/index';
import { UserRole } from '@models/enums/user-role.enum';

export type profilePermissionType = 'profile_view';

export const profilePermissionMatrix: IPermissionMatrix<profilePermissionType> = {
  profile_view: [UserRole.client, UserRole.admin]
};
