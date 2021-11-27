import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDataTableColumn } from '@models/interfaces/data-table-column.interface';
import { BasePaginationAbstractComponent } from '@misc/abstracts/base-pagination.abstract.component';
import { QueryBuilder } from '@misc/query-builder';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T> extends BasePaginationAbstractComponent {
  @Input() queryParams: QueryBuilder;
  @Input() minWidth: string = '0';
  @Input() maxHeight: string = 'auto';
  @Input() emptyIcon: string = 'no';
  @Input() emptyMessage: string = 'MESSAGE.EMPTY_LIST';
  @Input() columns: IDataTableColumn[] = [];
  @Output() rowClick: EventEmitter<T> = new EventEmitter<T>();
  @Output() sort: EventEmitter<Sort> = new EventEmitter<Sort>();
  itemsPerPage = 10;

  get dataSource(): T[] {
    return this.list?.entities ?? [];
  }

  get displayedColumns(): string[] {
    return this.columns?.map((column: IDataTableColumn): string => column.columnName);
  }
}
