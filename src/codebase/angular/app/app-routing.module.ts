import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnauthGuard } from '@guards/unauth/unauth.guard';
import { AuthLayoutComponent } from '@layouts/auth/auth-layout.component';
import { AuthGuard } from '@guards/auth/auth.guard';
import { MeResolver } from '@resolvers/me/me.resolver';
import { MainLayoutComponent } from '@layouts/main/main-layout.component';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [UnauthGuard],
    component: AuthLayoutComponent,
    loadChildren: () => import('@views/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: { me: MeResolver },
    component: MainLayoutComponent,
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('@views/main/main.module').then(m => m.MainModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
