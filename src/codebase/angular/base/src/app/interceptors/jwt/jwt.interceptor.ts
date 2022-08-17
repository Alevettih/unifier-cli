import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '@services/auth/auth.service';
import { catchError, finalize, first, skipWhile, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private _isRefreshingToken: boolean = false;
  private readonly _HAS_TOKEN$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Inject(APP_CONFIG) private _config: IAppConfig, private _auth: AuthService, private _router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this._auth.addTokenToRequest(req)).pipe(
      catchError((error: HttpErrorResponse): Observable<HttpEvent<any>> => {
        if (error instanceof HttpErrorResponse && this.shouldHandleUnauthorized(error, req)) {
          return this._handleUnauthorized(req, next);
        } else {
          throw error;
        }
      })
    );
  }

  shouldHandleUnauthorized(error: HttpErrorResponse, req: HttpRequest<any>): boolean {
    const isUnauthorizedResponse: boolean = (error as HttpErrorResponse).status === 401;
    const isNotIgnoredPage: boolean = [].every((page: string): boolean => !this._router.url.includes(page));
    const isNotIgnoredEndpoint: boolean = ['/oauth/token'].every((endpoint: string): boolean => !req.url.includes(endpoint));

    return isUnauthorizedResponse && isNotIgnoredPage && isNotIgnoredEndpoint;
  }

  private _handleUnauthorized(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this._isRefreshingToken) {
      const observable$: Observable<any> = this._auth.token?.refresh ? this._auth.refreshToken() : this._auth.getTemporaryToken();

      this._isRefreshingToken = true;
      this._HAS_TOKEN$.next(false);

      return observable$.pipe(
        switchMap((): Observable<HttpEvent<any>> => {
          this._HAS_TOKEN$.next(true);
          return next.handle(this._auth.addTokenToRequest(req));
        }),
        catchError((error: HttpErrorResponse): never => {
          this._router.navigate(['', 'auth', 'log-in']);
          throw error;
        }),
        finalize((): void => {
          this._isRefreshingToken = false;
        })
      );
    } else {
      return this._HAS_TOKEN$.pipe(
        skipWhile((token: boolean): boolean => !token),
        first(),
        switchMap((): Observable<HttpEvent<any>> => next.handle(this._auth.addTokenToRequest(req)))
      );
    }
  }
}
