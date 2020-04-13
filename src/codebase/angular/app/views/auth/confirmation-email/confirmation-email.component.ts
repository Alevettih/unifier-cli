import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'confirmation-email',
  templateUrl: './confirmation-email.component.html',
  styleUrls: ['./confirmation-email.component.scss']
})
export class ConfirmationEmailComponent implements OnInit {
  heading: string = 'Your email address has been successfully confirmed!';
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
    return this.isError ? 'Try with another link' : 'In order to continue go to the application';
  }
}
