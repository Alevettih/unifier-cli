import { Injectable } from '@angular/core';
import { ApiBaseService } from '@services/api/api-base/api-base.service';
import { User } from '@models/user.model';
import { ServicesConfig } from '@services/http/http.service';
import { map } from 'rxjs/operators';
import { Entity } from '@models/_base.model';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';

export enum SendTokenType {
  resetPassword = 'reset_password',
  confirmEmail = 'confirm_email'
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends ApiBaseService<User> {
  protected URLPath = '/api/users';

  getMe(servicesConfig: ServicesConfig) {
    return this.http
      .get(`${this.config.apiUrl}/api/users/me`, {}, servicesConfig)
      .pipe(map((user: Entity): User => plainToClass(User, user)));
  }

  sendToken(email: string, type: SendTokenType, services?: ServicesConfig): Observable<any> {
    return this.http.post(`${this.config.apiUrl}/api/users/${email}/update-token`, { type }, {}, services);
  }

  setNewPassword(token, params: Params, services?: ServicesConfig): Observable<any> {
    return this.http.patch(
      `${this.config.apiUrl}/api/users/${token}/reset-password`,
      { plainPassword: params },
      {},
      services
    );
  }

  confirmEmail(token, services?: ServicesConfig): Observable<any> {
    return this.http.patch(`${this.config.apiUrl}/api/users/${token}/confirm-email`, null, {}, services);
  }
}
