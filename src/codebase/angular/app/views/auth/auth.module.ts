import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from '@views/auth/auth-routing.module';
import { LogInModule } from '@views/auth/log-in/log-in.module';
import { SignUpModule } from '@views/auth/sign-up/sign-up.module';
import { ConfirmationEmailModule } from '@views/auth/confirmation-email/confirmation-email.module';
import { ForgotPasswordModule } from '@views/auth/forgot-password/forgot-password.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthRoutingModule, LogInModule, SignUpModule, ForgotPasswordModule, ConfirmationEmailModule]
})
export class AuthModule {}
