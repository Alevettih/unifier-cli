import { Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';
import { tokensResponses } from '@interceptors/mock/token.responses';
import { usersResponses } from '@interceptors/mock/users.responses';
import { mergeMap } from 'rxjs/operators';

interface IMockHandler {
  handler(...params: any[]): Observable<HttpResponse<any>>;
}

interface IEndpointMock {
  [key: string]: IMockHandler;
}

interface IMockEndpoints {
  GET?: IEndpointMock;
  PATCH?: IEndpointMock;
  POST?: IEndpointMock;
  PUT?: IEndpointMock;
  DELETE?: IEndpointMock;
}

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  endpoints: IMockEndpoints = {
    GET: {
      [`${this.config.apiUrl}/api/users`]: { handler: usersResponses.list },
      [`${this.config.apiUrl}/api/users/:id`]: { handler: usersResponses.oneById }
    },
    POST: {
      [`${this.config.apiUrl}/oauth/v2/token`]: { handler: tokensResponses.accessToken },
      [`${this.config.apiUrl}/api/users`]: { handler: usersResponses.create },
      [`${this.config.apiUrl}/api/users/send/token`]: { handler: usersResponses.sendToken }
    },
    PATCH: {
      [`${this.config.apiUrl}/api/users/:token/confirm`]: { handler: usersResponses.confirmAccount },
      [`${this.config.apiUrl}/api/users/:token/password`]: { handler: usersResponses.updatePassword },
      [`${this.config.apiUrl}/api/users/:id`]: { handler: usersResponses.update },
      [`${this.config.apiUrl}/api/users/logout`]: { handler: usersResponses.logout }
    }
  };

  constructor(@Inject(APP_CONFIG) private config: IAppConfig) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const endpoint: { params: string[]; path: string } = this.getEndpoint(request);
    const currentMockEndpoint: IMockHandler =
      this.endpoints?.[request.method]?.[request.url] ?? this.endpoints?.[request.method]?.[endpoint?.path];

    if (currentMockEndpoint) {
      console.warn('Intercepted by API mock service: ', endpoint);
      console.warn('\tRequest headers: ', request?.headers);
      console.warn('\tRequest body: ', request?.body);
      console.warn('\tRequest Query params: ', request?.params);
    }

    return timer(300).pipe(
      mergeMap(
        (): Observable<HttpEvent<any>> =>
          currentMockEndpoint
            ? currentMockEndpoint.handler(endpoint.params, request.body ?? request.params, request.headers)
            : next.handle(request)
      )
    );
  }

  private getEndpoint(request: HttpRequest<any>): { params: string[]; path: string } {
    let res: { params: string[]; path: string };

    Object.keys(this.endpoints?.[request.method] ?? {}).forEach((path: string): void => {
      const params: string[] = this.findDiff(path, request.url);
      let updatedPath: string = path;

      if (path === request.url) {
        res = { params: null, path };
      }

      params.forEach((param: string): string => (updatedPath = updatedPath.replace(/:[a-z]+(?=\/)?/gi, param)));

      if (updatedPath === request.url) {
        res = { params, path };
      }
    });

    return res;
  }

  private findDiff(str1: string, str2: string): string[] {
    const diff: string[] = [];

    str2.split('/').forEach((val: string, i: number): void => {
      if (val !== str1.split('/')[i]) {
        diff.push(val);
      }
    });

    return diff;
  }
}
