import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface IHttpRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  context?: HttpContext;
  params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] };
  reportProgress?: boolean;
  withCredentials?: boolean;
  [key: string]: unknown;
}
