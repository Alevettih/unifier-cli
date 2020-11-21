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
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private storage: StorageService) {}

  get currentRole(): UserRole {
    return this.storage.get(StorageKey.role) as UserRole;
  }
}
