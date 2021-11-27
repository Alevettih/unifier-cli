import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { QueryBuilder } from '@misc/query-builder';
import { IPaginatePipeArgs } from '@models/interfaces/paginate-pipe-args.interface';
import { Params } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges, OnInit, OnDestroy {
  protected readonly DESTROYED$: Subject<void> = new Subject<void>();
  protected readonly PARAMS_CHANGED$: Subject<void> = new Subject<void>();
  @Input() queryParams: QueryBuilder;
  @Input() paginatePipeArgs: IPaginatePipeArgs;
  @Output() paginatePipeArgsChange: EventEmitter<IPaginatePipeArgs> = new EventEmitter<IPaginatePipeArgs>();
  perPage: number;
  page: number;

  ngOnInit(): void {
    this.initialize();
  }

  ngOnChanges({ paginatePipeArgs, queryParams }: SimpleChanges): void {
    if (paginatePipeArgs?.currentValue) {
      if (
        paginatePipeArgs?.currentValue?.itemsPerPage !== paginatePipeArgs?.previousValue?.itemsPerPage ||
        paginatePipeArgs?.currentValue?.currentPage !== paginatePipeArgs?.previousValue?.currentPage
      ) {
        this.queryParams.paginate(this.paginatePipeArgs.currentPage as number, this.paginatePipeArgs.itemsPerPage as number);
      }
    }

    if (queryParams?.currentValue) {
      this.page = this.queryParams.params[QueryBuilder.BASE_KEYS.PAGE];
      this.perPage = this.queryParams.params[QueryBuilder.BASE_KEYS.PER_PAGE];

      this.PARAMS_CHANGED$.next();
      this.queryParams.params$
        .pipe(
          takeUntil(this.PARAMS_CHANGED$),
          takeUntil(this.DESTROYED$),
          map(({ [QueryBuilder.BASE_KEYS.PAGE]: page, [QueryBuilder.BASE_KEYS.PER_PAGE]: perPage }): Params => ({ page, perPage })),
          tap(({ page, perPage }): void => {
            this.page = page;
            this.perPage = perPage;
          })
        )
        .subscribe(this.initialize.bind(this));
    }
  }

  ngOnDestroy(): void {
    this.DESTROYED$.next();
    this.DESTROYED$.complete();
  }

  paginate(page: number): void {
    this.setValue(page);
  }

  setValue(page: number) {
    this.queryParams.paginate(page, this.paginatePipeArgs?.itemsPerPage as number);
  }

  get pageIndex(): number {
    return (Number(this.paginatePipeArgs?.currentPage) || 1) - 1;
  }

  protected initialize(): void {
    this.paginatePipeArgs.currentPage = this.page;
    this.paginatePipeArgs.itemsPerPage = this.perPage;
    this.paginatePipeArgsChange.emit(this.paginatePipeArgs);

    if (!this.page) {
      this.setValue(1);
    }
  }
}
