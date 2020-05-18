import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, OnDestroy } from '@angular/core';
import { List } from '@models/_base.model';
import { PageEvent } from '@angular/material/paginator';
import { timer } from 'rxjs';
import { StyleDefinition } from '@angular/flex-layout';

export class PageChangeEvent {
  page: number;
  'per-page': number;

  constructor({ pageIndex, pageSize }: PageEvent) {
    this.page = pageIndex + 1;
    this['per-page'] = pageSize;
  }
}

@Component({
  selector: 'paginated-list',
  templateUrl: './paginated-list.component.html',
  styleUrls: ['./paginated-list.component.scss']
})
export class PaginatedListComponent implements OnInit, OnChanges {
  @Input() hidePagination: boolean = false;
  @Input() addBtnStyles: StyleDefinition;
  @Input() addBtnIconSize: string;
  @Input() emptyMessage: string;
  @Input() emptyIcon: string = 'no';
  @Input() columnWidth: string = '1fr';
  @Input() pageSize: number = 5;
  @Input() isLoading: boolean;
  @Input() list: List;
  @Input() hideAddBtn: boolean = false;
  @Input() itemTemplate: TemplateRef<any>;
  @Output() pageChange: EventEmitter<PageChangeEvent> = new EventEmitter<PageChangeEvent>();
  @Output() add: EventEmitter<void> = new EventEmitter<void>();
  entities: any[] = [];
  total: number = 0;
  pageIndex: number = 0;

  ngOnInit(): void {
    timer(0).subscribe((): void => {
      this.pageChange.emit(new PageChangeEvent({ pageIndex: 0, pageSize: this.pageSize } as PageEvent));
    });
  }

  ngOnChanges({ list }: SimpleChanges): void {
    if (list?.currentValue) {
      if (list.currentValue?.total !== this.total) {
        this.pageIndex = 0;
      }

      this.total = list?.currentValue?.total ?? 0;
      this.entities = list?.currentValue?.entities ?? [];
    }
  }

  get isEmpty(): boolean {
    return Boolean(!this.entities.length);
  }

  get gridTemplateColumnsValue(): string {
    return `repeat(auto-fill, minmax(${this.columnWidth ?? '1fr'}, 1fr))`;
  }

  onAdd(): void {
    this.add.emit();
  }

  onPageChange(pageEvent: PageEvent): void {
    this.pageIndex = pageEvent.pageIndex;
    this.pageChange.emit(new PageChangeEvent(pageEvent));
  }
}
