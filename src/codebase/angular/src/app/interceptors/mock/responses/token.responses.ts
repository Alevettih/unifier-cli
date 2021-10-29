import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IApiTokens } from '@models/interfaces/api-tokens.interface';
import { ILoginParams } from '@models/interfaces/login-params.interface';
import { UserRole } from '@models/enums/user-role.enum';

export interface ITokensResponses {
  accessToken(routeParams: string[], body: ILoginParams): Observable<HttpResponse<IApiTokens>>;
}

export const tokensResponses: ITokensResponses = {
  accessToken(routeParams: string[], body: ILoginParams): Observable<HttpResponse<IApiTokens>> {
    const username: string = (body instanceof FormData ? ((body as FormData).getAll('username')[0] as string) : body?.username) ?? '';
    const refresh: string = (body instanceof FormData ? ((body as FormData).getAll('refresh_token')[0] as string) : body?.username) ?? null;
    const tokenRole: string = username?.split?.('@')?.[0];
    const token: string = refresh ?? btoa(Object.values(UserRole).includes(tokenRole as UserRole) ? tokenRole : '');
    const entity: IApiTokens = {
      access_token: token,
      refresh_token: token
    };

    return of(
      new HttpResponse({
        status: 200,
        body: entity
      })
    );
  }
};
