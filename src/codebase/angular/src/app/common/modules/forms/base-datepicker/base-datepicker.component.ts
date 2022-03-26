import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { BaseFormFieldAbstractComponent } from '@misc/abstracts/base-form-field.abstract.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDatepickerControl, MatDatepickerPanel } from '@angular/material/datepicker/datepicker-base';

@Component({
  selector: 'base-datepicker',
  templateUrl: './base-datepicker.component.html',
  styleUrls: ['./base-datepicker.component.scss']
})
export class BaseDatepickerComponent extends BaseFormFieldAbstractComponent {
  @Input() startDate: Date = new Date();
  @Input() minDate: Date | string | number | undefined;
  @Input() maxDate: Date | string | number | undefined;
  @Input() startViewMode: 'month' | 'year' | 'multi-year' = 'multi-year';
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @ViewChild('dp3') datePicker: MatDatepickerPanel<
    MatDatepickerControl<Date | string | number>,
    Date | string | number | null,
    Date | string | number
  >;

  handleDateChange(event: MatDatepickerInputEvent<unknown>): void {
    this.dateChange.emit(event.value as Date);
  }

  onLabelClicked(): void {
    this.datePicker?.open();
  }
}
