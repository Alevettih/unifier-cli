import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '@shared/components/data-table/data-table.component';
import { PipesModule } from '@pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@shared/material/material.module';
import { PaginatorModule } from '@shared/components/paginator/paginator.module';
import { LoaderContainerModule } from '@shared/components/loader-container/loader-container.module';
import { CroppedTextModule } from '../cropped-text/cropped-text.module';

@NgModule({
  declarations: [DataTableComponent],
  imports: [CommonModule, PipesModule, TranslateModule, MaterialModule, PaginatorModule, LoaderContainerModule, CroppedTextModule],
  exports: [DataTableComponent]
})
export class DataTableModule {}
