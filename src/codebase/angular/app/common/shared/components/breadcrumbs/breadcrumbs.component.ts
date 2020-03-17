import { Component, Input, OnInit } from '@angular/core';
import { BreadcrumbsService, Breadcrumb } from '@services/breadcrumbs/breadcrumbs.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs$: BehaviorSubject<Breadcrumb[]>;
  @Input() hidden: boolean;

  constructor(private breadcrumbsService: BreadcrumbsService) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbsService.breadcrumbs$;
  }
}
