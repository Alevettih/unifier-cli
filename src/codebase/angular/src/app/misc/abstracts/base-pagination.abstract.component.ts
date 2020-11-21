import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { List } from '@models/classes/_base.model';
import { PaginatePipeArgs } from 'ngx-pagination/dist/paginate.pipe';
import { getRandomIdentifier } from '@misc/helpers/get-random-identifier.function';
import { PER_PAGE_DEFAULT } from '@misc/constants/_base.constant';

@Component({
  template: ''
})
export abstract class BasePaginationAbstractComponent implements OnChanges {
  private readonly paginatorId: string = getRandomIdentifier();
  @Input() isLoading: boolean;
  @Input() list: List;
  @Input() itemsPerPage: number = PER_PAGE_DEFAULT;
  currentPage: number = 1;
  entities: any[] = [];
  totalItems: number = 0;

  constructor(protected cdr: ChangeDetectorRef) {}

  ngOnChanges({ list, itemsPerPage }: SimpleChanges): void {
    if (list?.currentValue) {
      if (list.currentValue?.total !== this.totalItems) {
        this.currentPage = 1;
      }

      this.totalItems = list?.currentValue?.total ?? 0;
      this.entities = list?.currentValue?.entities ?? [];
    }

    if (itemsPerPage?.currentValue) {
      this.currentPage = 1;
      this.itemsPerPage = Number(itemsPerPage?.currentValue);
    }
  }

  get paginatePipeArgs(): PaginatePipeArgs {
    return {
      id: this.paginatorId,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
      totalItems: this.totalItems
    };
  }

  set paginatePipeArgs({ currentPage, totalItems }: PaginatePipeArgs) {
    this.currentPage = Number(currentPage);
    this.totalItems = Number(totalItems);
    this.cdr.detectChanges();
  }

  get shouldShowPagination(): boolean {
    return this.totalItems > this.itemsPerPage;
  }
}
