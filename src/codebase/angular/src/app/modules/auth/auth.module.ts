import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from '@modules/auth/auth-routing.module';
import { LogInModule } from '@modules/auth/log-in/log-in.module';
import { SignUpModule } from '@modules/auth/sign-up/sign-up.module';
import { ConfirmationEmailModule } from '@modules/auth/confirmation-email/confirmation-email.module';
import { ForgotPasswordModule } from '@modules/auth/forgot-password/forgot-password.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthRoutingModule, LogInModule, SignUpModule, ForgotPasswordModule, ConfirmationEmailModule]
})
export class AuthModule {}
