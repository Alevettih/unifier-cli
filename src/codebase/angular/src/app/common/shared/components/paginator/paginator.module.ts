import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from '@shared/material/material.module';

@NgModule({
  declarations: [PaginatorComponent],
  exports: [PaginatorComponent, NgxPaginationModule],
  imports: [CommonModule, NgxPaginationModule, MaterialModule]
})
export class PaginatorModule {}
