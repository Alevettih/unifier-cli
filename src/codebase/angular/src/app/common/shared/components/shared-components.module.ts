import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from './breadcrumbs/breadcrumbs.module';
import { LoaderContainerModule } from './loader-container/loader-container.module';
import { PaginatedListModule } from './paginated-list/paginated-list.module';
import { DataTableModule } from './data-table/data-table.module';
import { PaginatorModule } from './paginator/paginator.module';
import { CroppedTextModule } from './cropped-text/cropped-text.module';
import { DropdownModule } from '@shared/components/dropdown/dropdown.module';
import { NotificationModule } from '@shared/components/notification/notification.module';

// Components

@NgModule({
  exports: [
    BreadcrumbsModule,
    LoaderContainerModule,
    PaginatedListModule,
    DataTableModule,
    PaginatorModule,
    CroppedTextModule,
    DropdownModule,
    NotificationModule
  ]
})
export class SharedComponentsModule {}
