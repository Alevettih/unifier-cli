import { Component, Input } from '@angular/core';
import { IDataTableColumn } from '@models/interfaces/data-table-column.interface';
import { BasePaginationAbstractComponent } from '@misc/abstracts/base-pagination.abstract.component';
import { QueryParamsService } from '@services/query-params/query-params.service';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T> extends BasePaginationAbstractComponent {
  @Input() queryParams: QueryParamsService;
  @Input() minWidth: string = '0';
  @Input() maxHeight: string = 'auto';
  @Input() emptyIcon: string = 'no';
  @Input() emptyMessage: string = 'MESSAGE.EMPTY_LIST';
  @Input() columns: IDataTableColumn[] = [];
  @Input() rowClick: (row: T) => any;

  get dataSource(): T[] {
    return this.list?.entities ?? [];
  }

  get isEmpty(): boolean {
    return !this.dataSource.length && !this.isLoading;
  }

  get displayedColumns(): string[] {
    return this.columns?.map((column: IDataTableColumn): string => column.columnName);
  }
}
