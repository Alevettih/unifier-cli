import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '@services/notification/notification.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoaderService } from '@services/loader/loader.service';
import { IErrorDescription, HttpServiceError } from '@services/http/http-service-error.class';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarNotificationType } from '@models/enums/snack-bar-notification-type.enum';

export interface IServicesConfig {
  skipErrorNotification?: ((err: HttpServiceError) => boolean) | boolean;
  showSuccessNotification?: { text: string };
  skipLoaderStart?: boolean;
  skipLoaderEnd?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService extends HttpClient {
  constructor(
    handler: HttpHandler,
    private _notification: NotificationService,
    private _loader: LoaderService,
    private _translate: TranslateService
  ) {
    super(handler);
  }

  override get(url: string, options?: any, services?: IServicesConfig | null): Observable<any> {
    this._startLoader(services);
    const httpOptions: { headers: HttpHeaders } = {
      headers: new HttpHeaders({
        Accept: 'application/ld+json'
      })
    };

    return super
      .get(url, { ...httpOptions, ...options })
      .pipe(
        tap(this._onSuccess.bind(this, services)),
        catchError(this._onError.bind(this, services)),
        finalize(this._onEveryCase.bind(this, services))
      );
  }

  override post(url: string, body: any | null, options?: any, services?: IServicesConfig | null): Observable<any> {
    this._startLoader(services);

    return super
      .post(url, body, options)
      .pipe(
        tap(this._onSuccess.bind(this, services)),
        catchError(this._onError.bind(this, services)),
        finalize(this._onEveryCase.bind(this, services))
      );
  }

  override patch(url: string, body: any | null, options?: any, services?: IServicesConfig | null): Observable<any> {
    this._startLoader(services);
    const httpOptions: { headers: HttpHeaders } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/merge-patch+json'
      })
    };
    return super
      .patch(url, body, { ...httpOptions, ...options })
      .pipe(
        tap(this._onSuccess.bind(this, services)),
        catchError(this._onError.bind(this, services)),
        finalize(this._onEveryCase.bind(this, services))
      );
  }

  override delete(url: string, options?: any, services?: IServicesConfig | null): Observable<any> {
    this._startLoader(services);

    return super
      .delete(url, options)
      .pipe(
        tap(this._onSuccess.bind(this, services)),
        catchError(this._onError.bind(this, services)),
        finalize(this._onEveryCase.bind(this, services))
      );
  }

  override put(url: string, body: any | null, options?: any, services?: IServicesConfig | null): Observable<any> {
    this._startLoader(services);

    return super
      .put(url, body, options)
      .pipe(
        tap(this._onSuccess.bind(this, services)),
        catchError(this._onError.bind(this, services)),
        finalize(this._onEveryCase.bind(this, services))
      );
  }

  private _onSuccess(config: IServicesConfig): void {
    if (config?.showSuccessNotification) {
      this._notification.addToQueue(
        {
          message: config?.showSuccessNotification?.text ?? 'Request successfully sent!'
        },
        SnackBarNotificationType.success
      );
    }
  }

  private _onError(config: IServicesConfig, error: HttpErrorResponse): Observable<HttpServiceError> {
    const customError: HttpServiceError = new HttpServiceError(error);

    if (
      !config ||
      !(typeof config.skipErrorNotification === 'boolean' ? config.skipErrorNotification : config.skipErrorNotification?.(customError))
    ) {
      customError.descriptions.forEach(({ key, message }: IErrorDescription): void => {
        const notificationMessage: string = key ? this._translate.instant(`BACKEND_ERRORS.${key.toUpperCase()}`) : message;

        this._notification.addToQueue({ message: notificationMessage }, SnackBarNotificationType.error);
      });
    }

    throw customError;
  }

  private _onEveryCase(config: IServicesConfig): void {
    this._endLoader(config);
  }

  private _startLoader(config: IServicesConfig): void {
    if (!config || (config && !config.skipLoaderStart)) {
      this._loader.on();
    }
  }

  private _endLoader(config: IServicesConfig): void {
    if (!config || (config && !config.skipLoaderEnd)) {
      this._loader.off();
    }
  }
}
