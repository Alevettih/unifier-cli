import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationEmailGuard implements CanActivate {
  constructor(private _router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const hasToken: boolean = next.queryParamMap.has('token');

    if (!hasToken) {
      this._router.navigate(['', 'auth', 'log-in']);
      return false;
    }

    return true;
  }
}
