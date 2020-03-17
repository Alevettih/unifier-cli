import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoaderService } from '@services/loader/loader.service';
import { TitleCasePipe } from '@angular/common';

export interface ServicesConfig {
  skipLoaderStart?: boolean;
  skipLoaderEnd?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService extends HttpClient {
  private toTitleCase: (value: string) => string = new TitleCasePipe().transform;

  constructor(handler: HttpHandler, private loader: LoaderService) {
    super(handler);
  }

  private isFormError(error: HttpErrorResponse): boolean {
    return Boolean(error.error.fields);
  }

  private getErrorMessage(error: HttpErrorResponse): string[] {
    return this.isFormError(error) ? this.getFormFieldsErrorMessages(error) : [this.getSimpleErrorMessage(error)];
  }

  private getSimpleErrorMessage(error: HttpErrorResponse): string {
    let message = `${error.status}: ${error.statusText}`;

    if (error.error) {
      if (error.error.error_description) {
        message = error.error.error_description;
      }

      if (error.error.message) {
        message = error.error.message;
      }
    }

    return message;
  }

  private getFormFieldsErrorMessages(error: HttpErrorResponse): string[] {
    const { fields } = error.error;
    const messages: string[] = [];

    if (fields) {
      Object.keys(fields).forEach((key: string) => {
        const { errors } = fields[key];

        const itemErrorsList: string[] = errors.map(({ description }) => description);
        messages.push(`${this.toTitleCase(key)} field is invalid: ${itemErrorsList.join(', ')}`);
      });
    }

    return messages;
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

  private onSuccess(config: ServicesConfig) {}

  private onError(config: ServicesConfig, error: HttpErrorResponse) {
    return throwError(error);
  }

  private onEveryCase(config: ServicesConfig) {
    this.endLoader(config);
  }

  private startLoader(config: ServicesConfig) {
    if (!config || (config && !config.skipLoaderStart)) {
      this.loader.on();
    }
  }

  private endLoader(config: ServicesConfig) {
    if (!config || (config && !config.skipLoaderEnd)) {
      this.loader.off();
    }
  }
}
