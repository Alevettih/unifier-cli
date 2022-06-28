import { UserRole } from '@models/enums/user-role.enum';
import { permissionMatrix, permissionType } from '@directives/has-permissions/permission-matrix';

export function hasPermissions(currentRole: UserRole, permissions: permissionType[]): boolean {
  return (
    !permissions ||
    permissions
      .map((permission: permissionType): UserRole[] => permissionMatrix[permission])
      .some((roles: UserRole[]): boolean => roles?.includes?.(currentRole))
  );
}
