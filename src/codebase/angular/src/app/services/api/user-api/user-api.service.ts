import { Injectable } from '@angular/core';
import { ApiBaseAbstractService, ITransitData } from '@misc/abstracts/api-base.abstract.service';
import { User } from '@models/classes/user.model';
import { IServicesConfig } from '@services/http/http.service';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { ClassType } from 'class-transformer/ClassTransformer';
import { UserTokenAction } from '@models/enums/user-token-action.enum';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends ApiBaseAbstractService<User> {
  protected readonly URLPath: string = '/api/users';
  protected readonly model: ClassType<User> = User;

  getMe(services?: IServicesConfig): Observable<User> {
    return this.getItem('me', { expand: 'profile.attachmentFiles' }, services);
  }

  logout(services?: IServicesConfig): Observable<void> {
    return this.http.patch(`${this.config.apiUrl}/api/users/logout`, null, {}, services);
  }

  availableEmail(email: string, services?: IServicesConfig): Observable<any> {
    return this.http.get(`${this.config.apiUrl}/api/users/available/email/${email}`, {}, services);
  }

  sendToken(email: string, type: UserTokenAction, payload?: { [key: string]: string }, services?: IServicesConfig): Observable<any> {
    return this.http.post(`${this.config.apiUrl}/api/users/send/token`, { email, type, payload }, {}, services);
  }

  updatePassword(token: string, params: Params, services?: IServicesConfig): Observable<any> {
    return this.http.patch(`${this.config.apiUrl}/api/users/${token}/password`, { user: params }, {}, services);
  }

  confirmAccount(token: string, services?: IServicesConfig): Observable<any> {
    return this.http.patch(`${this.config.apiUrl}/api/users/${token}/confirm`, { user: { confirmed: true } }, {}, services);
  }
}
