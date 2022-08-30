import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { VALIDATORS_SET } from '@misc/constants/validators-set.constant';
import { UserTokenAction } from '@models/enums/user-token-action.enum';
import { UserApiService } from '@services/api/user-api/user-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseFormAbstractComponent } from '@misc/abstracts/base-form.abstract.component';

@Component({
  selector: 'reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent extends BaseFormAbstractComponent implements OnInit {
  readonly PAGE_KEY: string = 'AUTH.';

  constructor(
    private _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
    private _userApi: UserApiService,
    private _router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      email: ['', [Validators.required, VALIDATORS_SET.EMAIL]]
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this._userApi
      .sendToken(this.form.email.value, UserTokenAction.resetPassword, null, { skipErrorNotification: true })
      .subscribe(this.onSubscribeNext.bind(this));
  }

  onSubscribeNext(): void {
    this._router.navigate(['', 'auth', 'log-in']);
  }
}
