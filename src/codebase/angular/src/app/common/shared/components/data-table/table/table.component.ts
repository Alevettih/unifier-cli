import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { IPaginatePipeArgs } from '@models/interfaces/paginate-pipe-args.interface';
import { IDataTableColumn } from '@models/interfaces/data-table-column.interface';
import { QueryBuilder } from '@misc/query-builder';

@Component({
  selector: 'table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnChanges {
  @ViewChild(MatSort) matSort: MatSort;
  @Input() queryParams: QueryBuilder;
  @Input() minWidth: string = '0';
  @Input() paginatePipeArgs: IPaginatePipeArgs;
  @Input() dataSource: T[];
  @Input() columns: IDataTableColumn[] = [];
  @Input() displayedColumns: string[] = [];
  @Output() rowClick: EventEmitter<T> = new EventEmitter<T>();
  @Output() sort: EventEmitter<Sort> = new EventEmitter<Sort>();

  ngOnChanges({ columns }: SimpleChanges): void {
    if (columns?.currentValue) {
      columns.currentValue.forEach(({ columnName, sort }: IDataTableColumn): void => {
        if (sort?.defaultDirection) {
          this.matSort.active = sort?.name || columnName;
          this.matSort.direction = sort?.defaultDirection;
          this._setSortParams(sort?.name || columnName, sort?.defaultDirection);
        }
      });
    }
  }

  onSort(sortState: Sort): void {
    const column: IDataTableColumn = this.columns.find((column: IDataTableColumn): boolean => column.columnName === sortState.active);
    this._setSortParams(column?.sort?.name || sortState.active, sortState.direction);
  }

  private _setSortParams(active: string, direction: SortDirection): void {
    this.sort.emit({ active, direction });
  }
}
