import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserRole } from '@models/enums/user-role.enum';
import { StorageService } from '@services/storage/storage.service';
import { StorageKey } from '@models/enums/storage-key.enum';

@Directive({
  selector: '[showForRoles]'
})
export class ShowForRolesDirective {
  @Input() set showForRoles(roles: UserRole[]) {
    if (roles.includes(this.currentRole)) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  }

  constructor(private _templateRef: TemplateRef<any>, private _viewContainer: ViewContainerRef, private _storage: StorageService) {}

  get currentRole(): UserRole {
    return this._storage.get(StorageKey.role) as UserRole;
  }
}
