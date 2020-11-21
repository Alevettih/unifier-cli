import { Component, Input } from '@angular/core';
import { IDataTableColumn } from '@models/interfaces/data-table-column.interface';
import { BasePaginationAbstractComponent } from '@misc/abstracts/base-pagination.abstract.component';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent extends BasePaginationAbstractComponent {
  @Input() minWidth: string = '0';
  @Input() maxHeight: string = 'auto';
  @Input() emptyIcon: string = 'no';
  @Input() emptyMessage: string = 'MESSAGE.EMPTY_LIST';
  @Input() columns: IDataTableColumn[] = [];

  get dataSource(): any[] {
    return this.list?.entities ?? [];
  }

  get displayedColumns(): string[] {
    return this.columns?.map((column: IDataTableColumn): string => column.columnName);
  }
}
