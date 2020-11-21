import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from '@modules/auth/log-in/log-in.component';
import { ForgotPasswordComponent } from '@modules/auth/forgot-password/forgot-password.component';
import { SignUpComponent } from '@modules/auth/sign-up/sign-up.component';
import { ConfirmationEmailComponent } from '@modules/auth/confirmation-email/confirmation-email.component';
import { ConfirmationTokenResolver } from '@resolvers/confirmation-token/confirmation-token.resolver';
import { ConfirmationEmailGuard } from '@guards/confirmation-email/confirmation-email.guard';

const routes: Routes = [
  {
    path: 'log-in',
    component: LogInComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'confirmation-email',
    component: ConfirmationEmailComponent,
    canActivate: [ConfirmationEmailGuard],
    resolve: {
      emailConfirmationErrorMessage: ConfirmationTokenResolver
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'log-in'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
