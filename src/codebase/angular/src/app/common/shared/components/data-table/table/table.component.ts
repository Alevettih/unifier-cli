import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
import { IPaginatePipeArgs } from '@models/interfaces/paginate-pipe-args.interface';
import { IDataTableColumn } from '@models/interfaces/data-table-column.interface';
import { QueryParamsConnectedAbstractComponent } from '@misc/abstracts/query-params-connected-abstract.component';
import { Params } from '@angular/router';

@Component({
  selector: 'table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> extends QueryParamsConnectedAbstractComponent {
  @Input() minWidth: string = '0';
  @Input() paginatePipeArgs: IPaginatePipeArgs;
  @Input() dataSource: T[];
  @Input() columns: IDataTableColumn[] = [];
  @Input() displayedColumns: string[] = [];
  @Output() rowClick: EventEmitter<T> = new EventEmitter<T>();

  onSort(event: Sort): void {
    this.value = event;
  }

  get value(): Sort {
    const params: Params = this.activatedRoute.snapshot.queryParams;
    const currentSortKey: string = this.paramsBuilder.getCurrentSortKey(params);
    const active: string = currentSortKey.replace(/^order\[(.*)]$/gi, '$1');
    const direction: SortDirection = this.activatedRoute.snapshot.queryParamMap.get(currentSortKey) as SortDirection;

    return { active, direction };
  }

  set value(sorting: Sort) {
    const { active, direction }: Sort = sorting as Sort;
    this.paramsBuilder.sort(active, direction);
    this.applyQueryParams();
  }
}
