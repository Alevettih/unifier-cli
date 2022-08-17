import { Component, Input } from '@angular/core';
import { DATE_FORMAT } from '@misc/constants/_base.constant';

@Component({
  selector: 'date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent {
  @Input() value: Date | string | number;
  readonly DATE_FORMAT: typeof DATE_FORMAT = DATE_FORMAT;
}
