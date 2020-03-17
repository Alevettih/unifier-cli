import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '@services/auth/auth.service';
import { catchError, finalize, first, skipWhile, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from '@misc/constants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshingToken = false;
  private tokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(this.auth.addTokenToRequest(req)).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (this.shouldHandleUnauthorized(error)) {
            return this.handleUnauthorized(req, next);
          } else {
            throw error;
          }
        }
      })
    );
  }

  shouldHandleUnauthorized(error) {
    const ignorePage = ['log-in', 'sign-up'];
    const isUnauthorizedResponse = (error as HttpErrorResponse).status === 401;
    const isNotIgnoredPage = ignorePage.every(page => !this.router.url.includes(page));

    return isUnauthorizedResponse && isNotIgnoredPage;
  }

  private handleUnauthorized(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(false);

      return this.auth.refreshToken().pipe(
        switchMap(() => {
          this.tokenSubject.next(true);
          return next.handle(this.auth.addTokenToRequest(req));
        }),
        catchError(error => {
          this.router.navigate(['', 'auth', 'log-in']);
          throw error;
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      return this.tokenSubject.pipe(
        skipWhile(token => !token),
        first(),
        switchMap(() => next.handle(this.auth.addTokenToRequest(req)))
      );
    }
  }
}
