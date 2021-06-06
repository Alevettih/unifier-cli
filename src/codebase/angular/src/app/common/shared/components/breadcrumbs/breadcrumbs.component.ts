import { Component, Input, OnInit } from '@angular/core';
import { BreadcrumbsService } from '@services/breadcrumbs/breadcrumbs.service';
import { BehaviorSubject } from 'rxjs';
import { IBreadcrumb } from '@models/interfaces/breadcrumbs/breadcrumb.interface';

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs$: BehaviorSubject<IBreadcrumb[]>;
  @Input() hidden: boolean;

  constructor(private _breadcrumbsService: BreadcrumbsService) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this._breadcrumbsService.breadcrumbs$;
  }
}
