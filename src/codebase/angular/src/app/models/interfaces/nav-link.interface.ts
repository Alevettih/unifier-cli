import { UserRole } from '@models/enums/user-role.enum';

export interface INavLink {
  path: string;
  title: string;
  roles?: UserRole[];
  icon?: string;
  action?: (...params: any[]) => any;
}
