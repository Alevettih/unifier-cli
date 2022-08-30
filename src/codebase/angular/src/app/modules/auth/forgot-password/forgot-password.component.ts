import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  token: string;
  withToken: boolean = false;

  constructor(private _auth: AuthService, private _activatedRoute: ActivatedRoute) {
    this._activatedRoute.queryParams.subscribe(({ token }: Params): void => {
      if (token) {
        this.token = token;
      }

      this.withToken = !!this.token;
    });
  }

  ngOnInit(): void {
    this._auth.clearTokens();
    this._auth.getTemporaryToken().subscribe();
  }

  ngOnDestroy(): void {
    this._auth.clearTokens();
  }
}
