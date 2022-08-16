import { NgModule, Type } from '@angular/core';
import { RouterModule, Routes, ROUTES } from '@angular/router';
import { MeResolver } from '@resolvers/me/me.resolver';
import { AuthLayoutComponent } from '@layouts/auth/auth-layout.component';
import { MainLayoutComponent } from '@layouts/main/main-layout.component';
import { CommonModule } from '@angular/common';
import { roleMatcher } from '@matchers/roleMatcher';
import { UserRole } from '@models/enums/user-role.enum';
import { AuthService } from '@services/auth/auth.service';
import { UnauthGuard } from '@guards/unauth/unauth.guard';
import { IRoleGuardParams, RoleGuard } from '@guards/role/role.guard';
import { AuthGuard } from '@guards/auth/auth.guard';
import { AuthModule } from '@modules/auth/auth.module';
import { ClientModule } from '@modules/main/client/client.module';

function config(authService: AuthService): Routes {
  return [
    {
      path: 'auth',
      canActivate: [UnauthGuard],
      component: AuthLayoutComponent,
      loadChildren: (): Promise<Type<AuthModule>> =>
        import('@modules/auth/auth.module').then((m: { AuthModule: Type<AuthModule> }): Type<AuthModule> => m.AuthModule)
    },
    {
      path: '',
      resolve: { me: MeResolver },
      canActivate: [AuthGuard, RoleGuard],
      component: MainLayoutComponent,
      runGuardsAndResolvers: 'always',
      data: {
        roleGuardParams: {
          redirectTo: ['', 'auth', 'log-in'],
          roles: [UserRole.client]
        } as IRoleGuardParams
      },
      children: [
        {
          matcher: roleMatcher(authService),
          loadChildren: (): Promise<Type<ClientModule>> =>
            import('@modules/main/client/client.module').then(
              (m: { ClientModule: Type<ClientModule> }): Type<ClientModule> => m.ClientModule
            ),
          data: {
            roles: [UserRole.client]
          }
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
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule],
  providers: [MeResolver, { provide: ROUTES, useFactory: config, deps: [AuthService], multi: true }]
})
export class AppRoutingModule {}
