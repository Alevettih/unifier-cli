import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@services/auth/auth.service';
import { UserRole } from '@models/enums/user-role.enum';
import { fromPromise } from 'rxjs/internal-compatibility';
import { NotificationService } from '@services/notification/notification.service';
import { SnackBarNotificationType } from '@models/enums/snack-bar-notification-type.enum';
import { TranslateService } from '@ngx-translate/core';

export interface IRoleGuardParams {
  roles: UserRole[];
  redirectTo: string[];
  skipErrorNotification?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _notification: NotificationService,
    private _translate: TranslateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this._isRoleAllowed(route?.data?.roleGuardParams ?? {});
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this._isRoleAllowed(childRoute?.data?.roleGuardParams ?? {});
  }

  private _isRoleAllowed({ redirectTo, roles, skipErrorNotification }: IRoleGuardParams): Observable<boolean> | boolean {
    const isRoleAllowed: boolean = Boolean((roles ?? [])?.find((role: UserRole): boolean => this._auth.myRole === role));

    if (!isRoleAllowed) {
      if (!skipErrorNotification) {
        this._notification.addToQueue({ message: this._translate.instant('BACKEND_ERRORS.ACCESS_DENIED') }, SnackBarNotificationType.error);
      }
      return redirectTo?.length ? fromPromise(this._router.navigate(redirectTo)) : false;
    }

    return isRoleAllowed;
  }
}
