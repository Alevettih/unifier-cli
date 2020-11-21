import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryParamsConnectedAbstractComponent } from '@misc/abstracts/query-params-connected-abstract.component';
import { QueryBuilder } from '@misc/query-builder';
import { PaginatePipeArgs } from 'ngx-pagination/dist/paginate.pipe';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent extends QueryParamsConnectedAbstractComponent {
  @Input() paginatePipeArgs: PaginatePipeArgs;
  @Output() paginatePipeArgsChange: EventEmitter<PaginatePipeArgs> = new EventEmitter<PaginatePipeArgs>();

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
    this.paramsBuilder.paginate(page);
    this.applyQueryParams();
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
