import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserRole } from '@models/enums/user-role.enum';
import { AuthService } from '@services/auth/auth.service';
import { hasPermissions } from '@misc/helpers/has-permissions.function';
import { permissionType } from '@directives/has-permissions/permission-matrix';

@Directive({
  selector: '[hasPermissions]'
})
export class HasPermissionsDirective implements OnInit {
  @Input() hasPermissionsThen: TemplateRef<any>;
  @Input() hasPermissionsElse: TemplateRef<any>;
  @Input() hasPermissions: permissionType[];

  get currentRole(): UserRole {
    return this._auth.myRole;
  }

  constructor(private _templateRef: TemplateRef<any>, private _viewContainer: ViewContainerRef, private _auth: AuthService) {}

  ngOnInit(): void {
    if (hasPermissions(this.currentRole, this.hasPermissions)) {
      this._viewContainer.createEmbeddedView(this.hasPermissionsThen ?? this._templateRef);
    } else if (this.hasPermissionsElse) {
      this._viewContainer.createEmbeddedView(this.hasPermissionsElse);
    } else {
      this._viewContainer.clear();
    }
  }
}
