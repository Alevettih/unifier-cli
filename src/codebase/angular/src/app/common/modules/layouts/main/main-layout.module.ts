import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule } from '@angular/router';
import { MainHeaderComponent } from './main-header/main-header.component';
import { SharedModule } from '@shared/shared.module';
import { ToolbarComponent } from '@layouts/main/toolbar/toolbar.component';

@NgModule({
  declarations: [MainLayoutComponent, MainHeaderComponent, ToolbarComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [MainLayoutComponent]
})
export class MainLayoutModule {}
