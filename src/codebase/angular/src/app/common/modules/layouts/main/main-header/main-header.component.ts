import { Component } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { User } from '@models/classes/user.model';
import { INavLink } from '@models/interfaces/nav-link.interface';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { navItems } from '@layouts/main/main-header/nav-items';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent {
  navigationItems: INavLink[] = navItems;

  constructor(private _router: Router, private _auth: AuthService, private _translate: TranslateService) {}

  get me(): User {
    return this._auth.me;
  }

  get userName(): string {
    return `${this._translate.instant('MESSAGE.HELLO')} <b>${this.me?.fullName}</b>!`;
  }

  logout(): void {
    this._auth.logout().subscribe(() => this._router.navigate(['']));
  }
}
