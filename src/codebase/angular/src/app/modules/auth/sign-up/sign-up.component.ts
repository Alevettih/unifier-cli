import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormAbstractComponent } from '@misc/abstracts/base-form.abstract.component';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';
import { UserApiService } from '@services/api/user-api/user-api.service';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent extends BaseFormAbstractComponent {
  constructor(private _formBuilder: FormBuilder, private _auth: AuthService, private _userApi: UserApiService, private _router: Router) {
    super();
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this._userApi.createItem(this.formGroup.getRawValue()).subscribe((): Promise<boolean> => this._router.navigate(['']));
  }
}
