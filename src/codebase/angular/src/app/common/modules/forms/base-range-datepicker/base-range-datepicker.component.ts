import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseFormFieldAbstractComponent } from '@misc/abstracts/base-form-field.abstract.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Params } from '@angular/router';

@Component({
  selector: 'base-range-datepicker',
  templateUrl: './base-range-datepicker.component.html',
  styleUrls: ['./base-range-datepicker.component.scss']
})
export class BaseRangeDatepickerComponent extends BaseFormFieldAbstractComponent implements OnInit {
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
  range: FormGroup;

  constructor(protected cdr: ChangeDetectorRef, protected translate: TranslateService, protected fb: FormBuilder) {
    super(cdr, translate);

    this.range = this.fb.group({
      start: this.fb.control(''),
      end: this.fb.control('')
    });
  }

  ngOnInit(): void {
    this.range.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        filter(({ start, end }: Params): boolean => Boolean(start && end))
      )
      .subscribe(({ start, end }: Params): void => {
        if (this.control) {
          this.control.setValue(`${start.toISOString()} <=> ${end.toISOString()}`);
        }
      });
  }

  handleDateChange(event: MatDatepickerInputEvent<unknown>): void {
    this.dateChange.emit(event.value as Date);
  }
}
