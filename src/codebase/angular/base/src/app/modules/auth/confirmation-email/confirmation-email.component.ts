import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'confirmation-email',
  templateUrl: './confirmation-email.component.html',
  styleUrls: ['./confirmation-email.component.scss']
})
export class ConfirmationEmailComponent implements OnInit {
  readonly PAGE_KEY: string = 'AUTH';
  heading: string = `${this.PAGE_KEY}.CONFIRMATION_SUCCESS`;
  isError: boolean;

  get subheading(): string {
    return this.isError ? `${this.PAGE_KEY}.TRY_ANOTHER_LINK` : `${this.PAGE_KEY}.GO_TO_APP`;
  }

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this._activatedRoute.data.subscribe(({ emailConfirmationErrorMessage }: Params): void => {
      this.isError = !!emailConfirmationErrorMessage;

      if (emailConfirmationErrorMessage) {
        this.heading = emailConfirmationErrorMessage;
      }
    });
  }
}
