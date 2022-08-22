import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { MaterialModule } from '@shared/material/material.module';
import { RouterModule } from '@angular/router';
import { AppFormsModule } from '@forms/forms.module';
import { DirectivesModule } from '@directives/directives.module';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [CommonModule, MaterialModule, RouterModule, AppFormsModule, DirectivesModule, PipesModule],
  exports: [BreadcrumbsComponent]
})
export class BreadcrumbsModule {}
