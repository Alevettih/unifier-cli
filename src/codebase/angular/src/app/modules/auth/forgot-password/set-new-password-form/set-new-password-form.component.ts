import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { VALIDATORS_SET } from '@misc/constants/validators-set.constant';
import { Router } from '@angular/router';
import { CustomValidators } from '@misc/custom-validators';
import { UserApiService } from '@services/api/user-api/user-api.service';
import { MatDialog } from '@angular/material/dialog';
import { BaseFormAbstractComponent } from '@misc/abstracts/base-form.abstract.component';

@Component({
  selector: 'set-new-password-form',
  templateUrl: './set-new-password-form.component.html',
  styleUrls: ['./set-new-password-form.component.scss']
})
export class SetNewPasswordFormComponent extends BaseFormAbstractComponent implements OnInit {
  @Input() token: string;
  readonly PAGE_KEY: string = 'AUTH.';

  constructor(
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
    private _userApi: UserApiService,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group(
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

    const { password: plainPassword }: { password: string; repeatPassword: string } = this.formGroup.getRawValue();

    this._userApi.updatePassword(this.token, { plainPassword }, { skipErrorNotification: true }).subscribe(this.onSubscribeNext.bind(this));
  }

  onSubscribeNext(): void {
    this._router.navigate(['', 'auth', 'log-in']);
  }
}
