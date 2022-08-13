import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { User } from '@models/classes/user/user.model';
import { AuthService } from '@services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeResolver implements Resolve<Observable<User> | User> {
  constructor(private _auth: AuthService) {}

  resolve(): Observable<User> | User {
    if (this._auth.isAuthenticated) {
      return this._auth.me || this._auth.getMe();
    } else {
      return null;
    }
  }
}
