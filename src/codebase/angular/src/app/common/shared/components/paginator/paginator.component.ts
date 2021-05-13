import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { QueryParamsConnectedAbstractComponent } from '@misc/abstracts/query-params-connected-abstract.component';
import { QueryBuilder } from '@misc/query-builder';
import { IPaginatePipeArgs } from '@models/interfaces/paginate-pipe-args.interface';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent extends QueryParamsConnectedAbstractComponent implements OnChanges {
  @Input() paginatePipeArgs: IPaginatePipeArgs;
  @Output() paginatePipeArgsChange: EventEmitter<IPaginatePipeArgs> = new EventEmitter<IPaginatePipeArgs>();

  ngOnChanges({ paginatePipeArgs }: SimpleChanges): void {
    if (paginatePipeArgs?.currentValue) {
      if (
        paginatePipeArgs?.currentValue?.itemsPerPage !== paginatePipeArgs?.previousValue?.itemsPerPage ||
        paginatePipeArgs?.currentValue?.currentPage !== paginatePipeArgs?.previousValue?.currentPage
      ) {
        this.paramsBuilder.paginate(this.paginatePipeArgs.currentPage as number, this.paginatePipeArgs.itemsPerPage as number);
        this.applyQueryParams();
      }
    }
  }

  paginate(page: number): void {
    this.value = page;
  }

  get perPage(): number {
    return parseInt(this.activatedRoute.snapshot.queryParamMap.get(QueryBuilder.BASE_KEYS.PER_PAGE), 10);
  }

  get value(): number {
    return parseInt(this.activatedRoute.snapshot.queryParamMap.get(QueryBuilder.BASE_KEYS.PAGE), 10);
  }

  set value(page: number) {
    this.paramsBuilder.paginate(page, this.paginatePipeArgs?.itemsPerPage as number);
    this.applyQueryParams();
  }

  get pageIndex(): number {
    return (Number(this.paginatePipeArgs?.currentPage) || 1) - 1;
  }

  protected initialize(): void {
    super.initialize();

    this.paginatePipeArgs.currentPage = this.value;
    this.paginatePipeArgs.itemsPerPage = this.perPage;
    this.paginatePipeArgsChange.emit(this.paginatePipeArgs);

    if (!this.value) {
      this.value = 1;
    }
  }
}
