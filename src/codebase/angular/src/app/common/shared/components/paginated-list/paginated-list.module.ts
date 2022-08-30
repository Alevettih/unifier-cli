import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatedListComponent } from '@shared/components/paginated-list/paginated-list.component';
import { LoaderContainerModule } from '@shared/components/loader-container/loader-container.module';
import { MaterialModule } from '@shared/material/material.module';
import { PaginatorModule } from '@shared/components/paginator/paginator.module';

@NgModule({
  declarations: [PaginatedListComponent],
  imports: [CommonModule, LoaderContainerModule, MaterialModule, PaginatorModule],
  exports: [PaginatedListComponent]
})
export class PaginatedListModule {}
