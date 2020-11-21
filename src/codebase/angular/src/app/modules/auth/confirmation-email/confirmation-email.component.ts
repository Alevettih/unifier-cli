import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'confirmation-email',
  templateUrl: './confirmation-email.component.html',
  styleUrls: ['./confirmation-email.component.scss']
})
export class ConfirmationEmailComponent implements OnInit {
  readonly pageKey: string = 'AUTH';
  heading: string = `${this.pageKey}.CONFIRMATION_SUCCESS`;
  isError: boolean;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emailConfirmationErrorMessage }: Params): void => {
      this.isError = !!emailConfirmationErrorMessage;

      if (emailConfirmationErrorMessage) {
        this.heading = emailConfirmationErrorMessage;
      }
    });
  }

  get subheading(): string {
    return this.isError ? `${this.pageKey}.TRY_ANOTHER_LINK` : `${this.pageKey}.GO_TO_APP`;
  }
}
