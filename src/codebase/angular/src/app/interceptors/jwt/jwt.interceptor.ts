import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '@services/auth/auth.service';
import { catchError, finalize, first, skipWhile, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshingToken: boolean = false;
  private tokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Inject(APP_CONFIG) private config: IAppConfig, private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.auth.addTokenToRequest(req)).pipe(
      catchError(
        (error: HttpErrorResponse): Observable<HttpEvent<any>> => {
          if (error instanceof HttpErrorResponse && this.shouldHandleUnauthorized(error)) {
            return this.handleUnauthorized(req, next);
          } else {
            throw error;
          }
        }
      )
    );
  }

  shouldHandleUnauthorized(error: HttpErrorResponse): boolean {
    const isUnauthorizedResponse: boolean = (error as HttpErrorResponse).status === 401;
    const isNotIgnoredPage: boolean = [].every((page: string): boolean => !this.router.url.includes(page));

    return isUnauthorizedResponse && isNotIgnoredPage;
  }

  private handleUnauthorized(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshingToken) {
      const observable$: Observable<any> = this.auth.token?.refresh ? this.auth.refreshToken() : this.auth.getTemporaryToken();

      this.isRefreshingToken = true;
      this.tokenSubject.next(false);

      return observable$.pipe(
        switchMap(
          (): Observable<HttpEvent<any>> => {
            this.tokenSubject.next(true);
            return next.handle(this.auth.addTokenToRequest(req));
          }
        ),
        catchError((error: HttpErrorResponse): never => {
          this.router.navigate(['', 'auth', 'log-in']);
          throw error;
        }),
        finalize((): void => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      return this.tokenSubject.pipe(
        skipWhile((token: boolean): boolean => !token),
        first(),
        switchMap((): Observable<HttpEvent<any>> => next.handle(this.auth.addTokenToRequest(req)))
      );
    }
  }
}
