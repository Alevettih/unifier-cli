import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [PaginatorComponent],
  exports: [PaginatorComponent, NgxPaginationModule],
  imports: [CommonModule, NgxPaginationModule]
})
export class PaginatorModule {}
