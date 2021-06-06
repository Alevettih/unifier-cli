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
    const entity: IApiTokens = {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
        'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
        'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    };

    switch (body?.username?.split?.('@')?.[0]) {
      case UserRole.admin:
        entity.access_token = btoa(UserRole.admin);
        break;
      default:
        entity.access_token = btoa('');
    }

    return of(
      new HttpResponse({
        status: 200,
        body: entity
      })
    );
  }
};
