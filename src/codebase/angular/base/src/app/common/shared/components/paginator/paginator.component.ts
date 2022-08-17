import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { IPaginatePipeArgs } from '@models/interfaces/paginate-pipe-args.interface';
import { Params } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { QueryParamsService } from '@services/query-params/query-params.service';
import { PER_PAGE_DEFAULT } from '@misc/constants/_base.constant';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges, OnInit, OnDestroy {
  @Input() queryParams: QueryParamsService;
  @Input() paginatePipeArgs: IPaginatePipeArgs;
  @Output() paginatePipeArgsChange: EventEmitter<IPaginatePipeArgs> = new EventEmitter<IPaginatePipeArgs>();
  perPage: number;
  page: number;
  protected readonly _DESTROYED$: Subject<void> = new Subject<void>();
  protected readonly _PARAMS_CHANGED$: Subject<void> = new Subject<void>();

  get pageIndex(): number {
    return (Number(this.paginatePipeArgs?.currentPage) || 1) - 1;
  }

  ngOnInit(): void {
    this._initialize();
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
      this.page = this.queryParams.params[QueryParamsService.BASE_KEYS.PAGE] ?? 1;
      this.perPage = this.queryParams.params[QueryParamsService.BASE_KEYS.PER_PAGE] ?? PER_PAGE_DEFAULT;

      this._PARAMS_CHANGED$.next();
      this.queryParams.params$
        .pipe(
          takeUntil(this._PARAMS_CHANGED$),
          takeUntil(this._DESTROYED$),
          map(
            ({ [QueryParamsService.BASE_KEYS.PAGE]: page, [QueryParamsService.BASE_KEYS.PER_PAGE]: perPage }): Params => ({ page, perPage })
          ),
          tap(({ page, perPage }): void => {
            this.page = page ?? 1;
            this.perPage = perPage ?? PER_PAGE_DEFAULT;
          })
        )
        .subscribe(this._initialize.bind(this));
    }
  }

  ngOnDestroy(): void {
    this._DESTROYED$.next();
    this._DESTROYED$.complete();
  }

  paginate(page: number): void {
    this.setValue(page);
  }

  setValue(page: number): void {
    this.queryParams.paginate(page, this.paginatePipeArgs?.itemsPerPage as number);
  }

  protected _initialize(): void {
    this.paginatePipeArgs.currentPage = this.page;
    this.paginatePipeArgs.itemsPerPage = this.perPage;
    this.paginatePipeArgsChange.emit(this.paginatePipeArgs);

    if (!this.page) {
      this.setValue(1);
    }
  }
}
