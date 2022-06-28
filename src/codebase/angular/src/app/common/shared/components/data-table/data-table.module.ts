import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '@shared/components/data-table/data-table.component';
import { PipesModule } from '@pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@shared/material/material.module';
import { PaginatorModule } from '@shared/components/paginator/paginator.module';
import { LoaderContainerModule } from '@shared/components/loader-container/loader-container.module';
import { CroppedTextModule } from '../cropped-text/cropped-text.module';
import { TableActionsComponent } from './table-actions/table-actions.component';
import { TableComponent } from './table/table.component';
import { DirectivesModule } from '@directives/directives.module';
import { DateComponent } from './cell-components/date/date.component';
import { SwitchToggleComponent } from './cell-components/switch-toggle/switch-toggle.component';
import { AppFormsModule } from '@forms/forms.module';

@NgModule({
  declarations: [DataTableComponent, TableActionsComponent, TableComponent, DateComponent, SwitchToggleComponent],
  imports: [
    CommonModule,
    PipesModule,
    TranslateModule,
    MaterialModule,
    PaginatorModule,
    LoaderContainerModule,
    CroppedTextModule,
    DirectivesModule,
    AppFormsModule
  ],
  exports: [DataTableComponent, TableActionsComponent, DateComponent, SwitchToggleComponent]
})
export class DataTableModule {}
