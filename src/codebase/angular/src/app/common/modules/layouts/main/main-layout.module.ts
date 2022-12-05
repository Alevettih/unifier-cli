import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { ToolbarComponent } from '@layouts/main/toolbar/toolbar.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

@NgModule({
  declarations: [MainLayoutComponent, ToolbarComponent, SideMenuComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [MainLayoutComponent]
})
export class MainLayoutModule {}
