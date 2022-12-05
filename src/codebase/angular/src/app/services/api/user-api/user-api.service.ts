import { Injectable } from '@angular/core';
import { ApiBaseAbstractService } from '@misc/abstracts/api-base.abstract.service';
import { User } from '@models/classes/user/user.model';
import { IServicesConfig } from '@services/http/http.service';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { ClassConstructor } from 'class-transformer';
import { UserTokenAction } from '@models/enums/user-token-action.enum';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends ApiBaseAbstractService<User> {
  protected readonly _URL_PATH: string = '/api/users';
  protected readonly _MODEL: ClassConstructor<User> = User;

  getMe(services?: IServicesConfig): Observable<User> {
    return this.getItem('me', services);
  }

  logout(services?: IServicesConfig): Observable<void> {
    return this._http.patch(`${this.url}/logout`, null, {}, services);
  }

  availableEmail(email: string, services?: IServicesConfig): Observable<any> {
    return this._http.get(`${this.url}/available/email/${email}`, {}, services);
  }

  sendToken(email: string, type: UserTokenAction, payload?: { [key: string]: string }, services?: IServicesConfig): Observable<any> {
    return this._http.post(`${this.url}/send/token`, { email, type, payload }, {}, services);
  }

  updatePassword(token: string, params: Params, services?: IServicesConfig): Observable<any> {
    return this._http.patch(`${this.url}/${token}/password`, { user: params }, {}, services);
  }

  confirmAccount(token: string, services?: IServicesConfig): Observable<any> {
    return this._http.patch(`${this.url}/${token}/confirm`, { user: { confirmed: true } }, {}, services);
  }
}
