import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDrawerMode } from '@angular/material/sidenav';
import { isPlatformBrowser } from '@angular/common';
import { Params } from '@angular/router';
import { User } from '@models/classes/user/user.model';
import { UserRole } from '@models/enums/user-role.enum';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private readonly _DESTROYED$: Subject<void> = new Subject<void>();

  get me(): User {
    return this._auth?.me;
  }

  get myRole(): UserRole {
    return this.me?.role;
  }

  get shouldBeOpen$(): Observable<boolean> {
    if (isPlatformBrowser(this._platformId)) {
      const style: CSSStyleDeclaration = window.getComputedStyle(document.documentElement);
      return this._breakpointObserver.observe(`(max-width: ${style.getPropertyValue('--tablet-s')})`).pipe(
        takeUntil(this._DESTROYED$),
        map(({ matches }: BreakpointState): boolean => !matches)
      );
    } else {
      return of(true);
    }
  }

  get sidenavMode$(): Observable<MatDrawerMode> {
    return this.shouldBeOpen$.pipe(
      takeUntil(this._DESTROYED$),
      map((shouldBeOpen: boolean): MatDrawerMode => (!shouldBeOpen ? 'over' : 'side'))
    );
  }

  constructor(
    private _auth: AuthService,
    private _breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private _platformId: Params
  ) {}
}
