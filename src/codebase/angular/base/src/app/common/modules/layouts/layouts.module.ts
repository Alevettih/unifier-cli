import { NgModule } from '@angular/core';
import { AuthLayoutModule } from '@layouts/auth/auth-layout.module';
import { MainLayoutModule } from '@layouts/main/main-layout.module';

@NgModule({
  exports: [MainLayoutModule, AuthLayoutModule]
})
export class LayoutsModule {}
