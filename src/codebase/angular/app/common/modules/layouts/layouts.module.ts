import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MainLayoutComponent } from '@layouts/main/main-layout.component';
import { AuthLayoutComponent } from '@layouts/auth/auth-layout.component';
import { AppFormsModule } from '@forms/forms.module';

@NgModule({
  declarations: [MainLayoutComponent, AuthLayoutComponent],
  imports: [CommonModule, SharedModule, AppFormsModule],
  exports: [MainLayoutComponent, AuthLayoutComponent]
})
export class LayoutsModule {}
