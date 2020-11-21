import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  token: string;
  withToken: boolean = false;

  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(({ token }: Params): void => {
      if (token) {
        this.token = token;
      }

      this.withToken = !!this.token;
    });
  }

  ngOnInit(): void {
    this.auth.clearTokens();
    this.auth
      .getTemporaryToken()
      .pipe(catchError(this.onSubscribeError.bind(this)))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.auth.clearTokens();
  }

  onSubscribeError(error: Error): void {
    console.error(error);
  }
}
