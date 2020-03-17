import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseForm } from '@misc/abstracts/base-form';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';
import { UserApiService } from '@services/api/user-api/user-api.service';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent extends BaseForm implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private userApi: UserApiService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.userApi.createItem(this.formGroup.getRawValue()).subscribe(() => this.router.navigate(['']));
  }
}
