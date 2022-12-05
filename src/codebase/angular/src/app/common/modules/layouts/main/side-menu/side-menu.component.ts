import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { INavLink } from '@models/interfaces/nav-link.interface';
import { navItems } from '@layouts/main/side-menu/navigation.config';
import { AuthService } from '@services/auth/auth.service';
import { InitPathService } from '@services/init-path/init-path.service';
import { Router } from '@angular/router';
import { mergeMap, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { UserBase } from '@models/classes/user/_user-base.model';
import { ModalService } from '@shared/modal/modal.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @ViewChild('asideEl') asideEl: ElementRef<HTMLElement>;
  @ViewChild('headerEl') headerEl: ElementRef<HTMLElement>;
  @ViewChild('footerEl') footerEl: ElementRef<HTMLElement>;
  isCollapsed: boolean = false;
  private readonly _DESTROYED$: Subject<void> = new Subject<void>();
  private _breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private _translate: TranslateService = inject(TranslateService);
  private _initPath: InitPathService = inject(InitPathService);
  private _modal: ModalService = inject(ModalService);
  private _auth: AuthService = inject(AuthService);
  private _router: Router = inject(Router);

  get navItems(): INavLink[] {
    return navItems;
  }

  get collapseButtonIcon(): 'chevron_right' | 'chevron_left' {
    return this.isCollapsed ? 'chevron_right' : 'chevron_left';
  }

  get user(): UserBase {
    return this._auth.me;
  }

  ngOnInit(): void {
    this.breakpointMatched$().subscribe((matched: boolean): void => {
      this.isCollapsed = matched;
    });
  }

  breakpointMatched$(): Observable<boolean> {
    const style: CSSStyleDeclaration = window.getComputedStyle(document.documentElement);
    return this._breakpointObserver.observe(`(max-width: ${style.getPropertyValue('--desktop-s')})`).pipe(
      takeUntil(this._DESTROYED$),
      map(({ matches }: BreakpointState): boolean => matches)
    );
  }

  toggleSize(event: MouseEvent): void {
    event.stopPropagation();
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    const key: `MODALS.LOGOUT` = `MODALS.LOGOUT`;

    this._modal
      .open({
        title: this._translate.instant(`${key}.TITLE`),
        message: this._translate.instant(`${key}.MESSAGE`),
        actions: [
          { value: false, name: this._translate.instant('BUTTON_NAME.CANCEL'), type: 'close' },
          { value: true, name: this._translate.instant('BUTTON_NAME.OK'), type: 'close' }
        ]
      })
      .pipe(mergeMap((): Observable<void> => this._auth.logout()))
      .subscribe(() => {
        this._initPath.clear();
        this._router.navigate(['', 'auth', 'log-in']);
      });
  }
}
