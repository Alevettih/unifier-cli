import { Component, Input, OnInit } from '@angular/core';
import { BaseForm } from '@misc/abstracts/base-form';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { VALIDATORS_SET } from '@misc/constants';
import { Router } from '@angular/router';
import { CustomValidators } from '@misc/custom-validators';
import { UserApiService } from '@services/api/user-api/user-api.service';

@Component({
  selector: 'set-new-password-form',
  templateUrl: './set-new-password-form.component.html',
  styleUrls: ['./set-new-password-form.component.scss']
})
export class SetNewPasswordFormComponent extends BaseForm implements OnInit {
  @Input() token: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private userApi: UserApiService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        password: ['', [Validators.required, VALIDATORS_SET.PASSWORD]],
        repeatPassword: ['', [Validators.required, VALIDATORS_SET.PASSWORD]]
      },
      { validators: [CustomValidators.mustMatch('password', 'repeatPassword')] }
    );
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    const { password: newPassword, repeatPassword: newPasswordConfirmation } = this.formGroup.getRawValue();

    this.userApi.setNewPassword(this.token, { newPassword, newPasswordConfirmation }).subscribe({
      next: this.onSubscribeNext.bind(this),
      error: this.onSubscribeError.bind(this)
    });
  }

  onSubscribeNext(): void {
    this.router.navigate(['', 'auth', 'log-in']);
  }

  onSubscribeError(error: Error): void {
    console.error(error);
  }
}
