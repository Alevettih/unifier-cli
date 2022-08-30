import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from '@modules/auth/forgot-password/forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import { SetNewPasswordFormComponent } from './set-new-password-form/set-new-password-form.component';
import { AppFormsModule } from '@forms/forms.module';
import { SharedModule } from '@shared/shared.module';

const routes: Routes = [{ path: '', component: ForgotPasswordComponent }];

@NgModule({
  declarations: [ForgotPasswordComponent, ResetPasswordFormComponent, SetNewPasswordFormComponent],
  imports: [CommonModule, RouterModule.forChild(routes), AppFormsModule, SharedModule],
  exports: [RouterModule]
})
export class ForgotPasswordModule {}
