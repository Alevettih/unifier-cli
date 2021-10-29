import { NgModule } from '@angular/core';
import { Routes, RouterModule, ROUTES } from '@angular/router';
import { UnauthGuard } from '@guards/unauth/unauth.guard';
import { AuthLayoutComponent } from '@layouts/auth/auth-layout.component';
import { AuthGuard } from '@guards/auth/auth.guard';
import { MeResolver } from '@resolvers/me/me.resolver';
import { MainLayoutComponent } from '@layouts/main/main-layout.component';
import { AuthModule } from '@modules/auth/auth.module';
import { AdminModule } from '@modules/main/admin/admin.module';
import { IRoleGuardParams, RoleGuard } from '@guards/role/role.guard';
import { UserRole } from '@models/enums/user-role.enum';
import { roleMatcher } from '@matchers/roleMatcher';
import { AuthService } from '@services/auth/auth.service';
import { CommonModule } from '@angular/common';

function config(authService: AuthService): Routes {
  return [
    {
      path: 'auth',
      canActivate: [UnauthGuard],
      component: AuthLayoutComponent,
      loadChildren: (): Promise<AuthModule> =>
        import('@modules/auth/auth.module').then((m: { AuthModule: AuthModule }): AuthModule => m.AuthModule)
    },
    {
      path: '',
      canActivate: [AuthGuard, RoleGuard],
      resolve: { me: MeResolver },
      component: MainLayoutComponent,
      runGuardsAndResolvers: 'always',
      data: {
        isAdminView: true,
        roleGuardParams: {
          redirectTo: ['', 'auth', 'log-in'],
          roles: [UserRole.admin],
          skipErrorNotification: true
        } as IRoleGuardParams
      },
      children: [
        {
          matcher: roleMatcher(authService),
          loadChildren: (): Promise<AdminModule> =>
            import('@modules/main/admin/admin.module').then((m: { AdminModule: AdminModule }): AdminModule => m.AdminModule),
          data: { roles: [UserRole.admin] }
        }
      ]
    },
    {
      path: '**',
      redirectTo: ''
    }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([], {
      paramsInheritanceStrategy: 'always',
      enableTracing: false,
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule],
  providers: [MeResolver, { provide: ROUTES, useFactory: config, deps: [AuthService], multi: true }]
})
export class AppRoutingModule {}
