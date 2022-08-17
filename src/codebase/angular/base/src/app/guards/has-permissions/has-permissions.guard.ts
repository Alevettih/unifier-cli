import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router } from '@angular/router';
import { UserRole } from '@models/enums/user-role.enum';
import { AuthService } from '@services/auth/auth.service';
import { hasPermissions } from '@misc/helpers/has-permissions.function';
import { permissionType } from '@directives/has-permissions/permission-matrix';

export interface IHasPermissionsGuardData {
  permissions: permissionType[];
}

@Injectable({
  providedIn: 'root'
})
export class HasPermissionsGuard implements CanActivate, CanLoad {
  get currentRole(): UserRole {
    return this._auth.myRole;
  }

  constructor(private _auth: AuthService, private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {
    return this.hasPermissions(route?.data?.permissions);
  }

  canLoad(route: Route): Promise<boolean> | boolean {
    return this.hasPermissions(route?.data?.permissions);
  }

  hasPermissions(permissions: permissionType[]): boolean {
    if (hasPermissions(this.currentRole, permissions)) {
      return true;
    } else {
      this._router.navigate(['', '404']);
      return false;
    }
  }
}
