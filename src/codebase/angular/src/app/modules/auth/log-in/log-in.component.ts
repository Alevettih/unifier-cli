import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { VALIDATORS_SET } from '@misc/constants/validators-set.constant';
import { BooleanFieldType } from '@forms/base-boolean-field/base-boolean-field.component';
import { TranslateService } from '@ngx-translate/core';
import { UserApiService } from '@services/api/user-api/user-api.service';
import { BaseFormAbstractComponent } from '@misc/abstracts/base-form.abstract.component';
import { InitPathService } from '@services/init-path/init-path.service';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent extends BaseFormAbstractComponent implements OnInit {
  readonly BooleanFieldType: typeof BooleanFieldType = BooleanFieldType;

  constructor(
    private _translate: TranslateService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
    private _userApi: UserApiService,
    private _activatedRoute: ActivatedRoute,
    private _initPath: InitPathService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      username: new FormControl('', [Validators.required, VALIDATORS_SET.EMAIL]),
      password: new FormControl('', [Validators.required]),
      shouldRemember: new FormControl(false)
    });
  }

  onSubmit(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    const { username, password, shouldRemember }: { username: string; password: string; shouldRemember: boolean } =
      this.formGroup.getRawValue();

    this._auth.login({ username, password }, shouldRemember).subscribe((): void => {
      this._router.navigate(this._initPath.initialUrl).then((): void => this._initPath.clear());
    });
  }
}
