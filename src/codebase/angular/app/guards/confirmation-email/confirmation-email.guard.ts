import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationEmailGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const hasToken = next.queryParamMap.has('token');

    if (!hasToken) {
      this.router.navigate(['', 'auth', 'log-in']);
      return false;
    }

    return true;
  }
}
