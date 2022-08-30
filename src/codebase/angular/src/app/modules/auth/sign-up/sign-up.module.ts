import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from '@modules/auth/sign-up/sign-up.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { PipesModule } from '@pipes/pipes.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [SignUpComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CdkStepperModule, PipesModule, SharedModule],
  exports: [RouterModule],
  providers: []
})
export class SignUpModule {}
