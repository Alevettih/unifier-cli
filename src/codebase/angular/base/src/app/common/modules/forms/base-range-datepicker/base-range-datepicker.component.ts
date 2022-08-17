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

  constructor(protected override _cdr: ChangeDetectorRef, protected override _translate: TranslateService, protected _fb: FormBuilder) {
    super(_cdr, _translate);

    this.range = this._fb.group({
      start: this._fb.control(''),
      end: this._fb.control('')
    });
  }

  ngOnInit(): void {
    this.range.valueChanges
      .pipe(
        takeUntil(this._DESTROYED$),
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
