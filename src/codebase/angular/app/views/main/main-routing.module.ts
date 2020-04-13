import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleMatcher } from '@matchers/roleMatcher';
import { Role } from '@models/user.model';
import { AdminModule } from '@views/main/admin/admin.module';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        matcher: roleMatcher,
        loadChildren: (): Promise<AdminModule> =>
          import('@views/main/admin/admin.module').then((m: { AdminModule: AdminModule }): AdminModule => m.AdminModule),
        data: { roles: [Role.admin] }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes), AdminModule],
  exports: [RouterModule]
})
export class MainRoutingModule {}
