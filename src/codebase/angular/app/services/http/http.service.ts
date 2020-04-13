import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NotificationService, NotificationType } from '@services/notification/notification.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoaderService } from '@services/loader/loader.service';
import { ErrorDescription, HttpServiceError } from '@services/http/http-service-error.class';

export interface ServicesConfig {
  skipErrorNotification?: boolean;
  skipLoaderStart?: boolean;
  skipLoaderEnd?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService extends HttpClient {
  constructor(handler: HttpHandler, private notification: NotificationService, private loader: LoaderService) {
    super(handler);
  }

  get(url: string, options?: any, services?: ServicesConfig | null): Observable<any> {
    this.startLoader(services);

    return super
      .get(url, options)
      .pipe(
        tap(this.onSuccess.bind(this, services)),
        catchError(this.onError.bind(this, services)),
        finalize(this.onEveryCase.bind(this, services))
      );
  }

  post(url: string, body: any | null, options?: any, services?: ServicesConfig | null): Observable<any> {
    this.startLoader(services);

    return super
      .post(url, body, options)
      .pipe(
        tap(this.onSuccess.bind(this, services)),
        catchError(this.onError.bind(this, services)),
        finalize(this.onEveryCase.bind(this, services))
      );
  }

  patch(url: string, body: any | null, options?: any, services?: ServicesConfig | null): Observable<any> {
    this.startLoader(services);

    return super
      .patch(url, body, options)
      .pipe(
        tap(this.onSuccess.bind(this, services)),
        catchError(this.onError.bind(this, services)),
        finalize(this.onEveryCase.bind(this, services))
      );
  }

  delete(url: string, options?: any, services?: ServicesConfig | null): Observable<any> {
    this.startLoader(services);

    return super
      .delete(url, options)
      .pipe(
        tap(this.onSuccess.bind(this, services)),
        catchError(this.onError.bind(this, services)),
        finalize(this.onEveryCase.bind(this, services))
      );
  }

  put(url: string, body: any | null, options?: any, services?: ServicesConfig | null): Observable<any> {
    this.startLoader(services);

    return super
      .put(url, body, options)
      .pipe(
        tap(this.onSuccess.bind(this, services)),
        catchError(this.onError.bind(this, services)),
        finalize(this.onEveryCase.bind(this, services))
      );
  }

  private onSuccess(config: ServicesConfig): void {}

  private onError(config: ServicesConfig, error: HttpErrorResponse): Observable<HttpServiceError> {
    const customError: HttpServiceError = new HttpServiceError(error);

    if (!config || !config.skipErrorNotification) {
      customError.descriptions.forEach(({ key, message }: ErrorDescription): void =>
        this.notification.addToQueue(key || message, NotificationType.error)
      );
    }

    return throwError(customError);
  }

  private onEveryCase(config: ServicesConfig): void {
    this.endLoader(config);
  }

  private startLoader(config: ServicesConfig): void {
    if (!config || (config && !config.skipLoaderStart)) {
      this.loader.on();
    }
  }

  private endLoader(config: ServicesConfig): void {
    if (!config || (config && !config.skipLoaderEnd)) {
      this.loader.off();
    }
  }
}
