import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleMatcher } from '@matchers/roleMatcher';
import { AdminModule } from '@modules/main/admin/admin.module';
import { UserRole } from '@models/enums/user-role.enum';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        matcher: roleMatcher,
        loadChildren: (): Promise<AdminModule> =>
          import('@modules/main/admin/admin.module').then((m: { AdminModule: AdminModule }): AdminModule => m.AdminModule),
        data: { roles: [UserRole.admin] }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes), AdminModule],
  exports: [RouterModule]
})
export class MainRoutingModule {}
