import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserRole } from '@models/enums/user-role.enum';
import { AuthService } from '@services/auth/auth.service';

@Directive({
  selector: '[showForRoles]'
})
export class ShowForRolesDirective {
  @Input() set showForRoles(roles: UserRole[]) {
    if (!roles?.length || roles.find((role: UserRole) => this.currentRole === role)) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  }

  get currentRole(): UserRole {
    return this._auth.myRole;
  }

  constructor(private _templateRef: TemplateRef<any>, private _viewContainer: ViewContainerRef, private _auth: AuthService) {}
}
