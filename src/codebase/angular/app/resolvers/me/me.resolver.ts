import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { User } from '@models/user.model';
import { AuthService } from '@services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeResolver implements Resolve<Observable<User> | User> {
  constructor(private auth: AuthService) {}

  resolve(): Observable<User> | User {
    if (this.auth.isAuthenticated) {
      return this.auth.me || this.auth.getMe();
    } else {
      return null;
    }
  }
}
