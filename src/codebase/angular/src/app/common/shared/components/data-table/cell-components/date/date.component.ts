import { Component, Input } from '@angular/core';
import { DATE_FORMAT } from '@misc/constants/_base.constant';

@Component({
  selector: 'date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent {
  readonly DATE_FORMAT: typeof DATE_FORMAT = DATE_FORMAT;
  @Input() value: Date | string | number;
}
