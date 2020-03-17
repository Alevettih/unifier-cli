import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { BaseForm } from '@misc/abstracts/base-form';
import { VALIDATORS_SET } from '@misc/constants';
import { SendTokenType, UserApiService } from '@services/api/user-api/user-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent extends BaseForm implements OnInit {
  constructor(
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
      .sendToken(this.form.email.value, SendTokenType.resetPassword)
      .subscribe(this.onSubscribeNext.bind(this));
  }

  onSubscribeNext(): void {
    this.router.navigate(['', 'auth', 'log-in']);
  }
}
