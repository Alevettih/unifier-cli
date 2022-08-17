import { Component, Input, TemplateRef } from '@angular/core';
import { BasePaginationAbstractComponent } from '@misc/abstracts/base-pagination.abstract.component';
import { QueryParamsService } from '@services/query-params/query-params.service';

@Component({
  selector: 'paginated-list',
  templateUrl: './paginated-list.component.html',
  styleUrls: ['./paginated-list.component.scss']
})
export class PaginatedListComponent extends BasePaginationAbstractComponent {
  @Input() queryParams: QueryParamsService;
  @Input() shouldHidePagination: boolean = false;
  @Input() emptyMessage: string;
  @Input() emptyIcon: string = 'no';
  @Input() columnWidth: string = '1fr';
  @Input() gridGap: string = '2.5rem';
  @Input() itemTemplate: TemplateRef<any>;

  get isEmpty(): boolean {
    return Boolean(!this.entities.length);
  }

  get gridTemplateColumnsValue(): string {
    return `repeat(auto-fill, minmax(${this.columnWidth ?? '1fr'}, 1fr))`;
  }
}
