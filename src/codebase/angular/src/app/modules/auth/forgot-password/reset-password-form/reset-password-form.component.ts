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
  readonly pageKey: string = 'AUTH.';

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private userApi: UserApiService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, VALIDATORS_SET.EMAIL]]
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.userApi
      .sendToken(this.form.email.value, UserTokenAction.resetPassword, null, { skipErrorNotification: true })
      .subscribe(this.onSubscribeNext.bind(this));
  }

  onSubscribeNext(): void {
    this.router.navigate(['', 'auth', 'log-in']);
  }
}
