import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppFormsModule } from '@forms/forms.module';
import { ModalsModule } from '@modals/modals.module';
import { PipesModule } from '@pipes/pipes.module';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { AddButtonComponent } from '@shared//components/add-button/add-button.component';
import { LoaderContainerComponent } from '@shared/components/loader-container/loader-container.component';
import { PaginatedListComponent } from '@shared/components/paginated-list/paginated-list.component';

// Components

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    AddButtonComponent,
    LoaderContainerComponent,
    PaginatedListComponent
  ],
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
    BreadcrumbsComponent,
    AddButtonComponent,
    LoaderContainerComponent,
    PaginatedListComponent
  ]
})
export class SharedModule {}
