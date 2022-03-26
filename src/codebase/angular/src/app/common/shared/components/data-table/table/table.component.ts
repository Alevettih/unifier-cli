import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { IPaginatePipeArgs } from '@models/interfaces/paginate-pipe-args.interface';
import { IDataTableColumn } from '@models/interfaces/data-table-column.interface';
import { QueryParamsService } from '@services/query-params/query-params.service';

@Component({
  selector: 'table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnChanges {
  @ViewChild(MatSort) matSort: MatSort;
  @Input() queryParams: QueryParamsService;
  @Input() minWidth: string = '0';
  @Input() paginatePipeArgs: IPaginatePipeArgs;
  @Input() dataSource: T[];
  @Input() columns: IDataTableColumn[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() rowClick: (row: T) => any;

  ngOnChanges({ columns }: SimpleChanges): void {
    if (columns?.currentValue) {
      columns.currentValue.forEach(({ columnName, sort }: IDataTableColumn): void => {
        if (sort?.defaultDirection) {
          const predefinedSort: Sort = this.queryParams.parseSorting();
          this.matSort.active = predefinedSort?.active ?? (sort?.name || columnName);
          this.matSort.direction = predefinedSort?.direction ?? sort?.defaultDirection;
          this._setSortParams(this.matSort.active, this.matSort.direction);
        }
      });
    }
  }

  onSort(sortState: Sort): void {
    const column: IDataTableColumn = this.columns.find((column: IDataTableColumn): boolean => column.columnName === sortState.active);
    this._setSortParams(column?.sort?.name || sortState.active, sortState.direction);
  }

  getAsDataTableColumn(item: IDataTableColumn): IDataTableColumn {
    return item as IDataTableColumn;
  }

  private _setSortParams(active: string, direction: SortDirection): void {
    this.queryParams.sort(active, direction);
  }
}
