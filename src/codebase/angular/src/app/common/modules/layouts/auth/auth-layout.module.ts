import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [AuthLayoutComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [AuthLayoutComponent]
})
export class AuthLayoutModule {}
