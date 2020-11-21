import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { VALIDATORS_SET } from '@misc/constants/validators-set.constant';
import { BooleanFieldType } from '@forms/base-boolean-field/base-boolean-field.component.ts';
import { TranslateService } from '@ngx-translate/core';
import { UserApiService } from '@services/api/user-api/user-api.service';
import { BaseFormAbstractComponent } from '@misc/abstracts/base-form.abstract.component';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent extends BaseFormAbstractComponent implements OnInit {
  readonly BooleanFieldType: typeof BooleanFieldType = BooleanFieldType;
  readonly pageKey: string = 'AUTH.';
  token: string;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private userApi: UserApiService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParams.token;
    this.formGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.required, VALIDATORS_SET.EMAIL]),
      password: new FormControl('', [Validators.required]),
      shouldRemember: new FormControl(false)
    });
    if (this.token) {
      this.userApi.confirmAccount(this.token, { skipErrorNotification: true }).subscribe();
      this.formGroup.addControl('terms', this.formBuilder.control(false, [Validators.requiredTrue]));
    }
  }

  onSubmit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    const {
      email: username,
      password,
      shouldRemember
    }: { email: string; password: string; shouldRemember: boolean } = this.formGroup.getRawValue();

    this.auth.login({ username, password }, shouldRemember, { skipErrorNotification: true }).subscribe((): void => {
      this.router.navigate(['']);
    });
  }
}
