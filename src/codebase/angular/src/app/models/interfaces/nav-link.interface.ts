import { UserRole } from '@models/enums/user-role.enum';
import { permissionType } from '@directives/has-permissions/permission-matrix';

export interface INavLink {
  title: string;
  path?: string;
  roles?: UserRole[];
  permissions?: permissionType[];
  icon?: string;
  children?: INavLink[];
}
