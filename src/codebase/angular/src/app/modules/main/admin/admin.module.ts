import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from '@modules/main/admin/admin-routing.module';
import { NotFoundPageModule } from '@modules/main/common/not-found-page/not-found-page.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, NotFoundPageModule, AdminRoutingModule]
})
export class AdminModule {}
