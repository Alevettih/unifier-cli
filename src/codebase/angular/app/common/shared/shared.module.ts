import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoaderComponent } from './components/loader/loader.component';
import { AppFormsModule } from '@forms/forms.module';
import { ModalsModule } from '@modals/modals.module';
import { PipesModule } from '@pipes/pipes.module';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';

// Components

@NgModule({
  declarations: [LoaderComponent, BreadcrumbsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    AppFormsModule,
    PipesModule
  ],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    AppFormsModule,
    ModalsModule,
    LoaderComponent,
    BreadcrumbsComponent
  ]
})
export class SharedModule {}
