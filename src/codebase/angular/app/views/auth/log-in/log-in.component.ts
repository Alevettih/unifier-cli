import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { BaseForm } from '@misc/abstracts/base-form';
import { VALIDATORS_SET } from '@misc/constants';
import { InputType } from '@forms/base-input/base-input.component';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent extends BaseForm implements OnInit {
  error: string;
  InputType = InputType;

  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthService) {
    super();
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.required, VALIDATORS_SET.EMAIL]),
      password: new FormControl('', [Validators.required]),
      shouldRemember: new FormControl(false)
    });

    this.auth.logout();
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    const { email: username, password, shouldRemember } = this.formGroup.getRawValue();

    this.auth.login({ username, password }, shouldRemember).subscribe(
      (): void => {
        this.router.navigate(['']);
      },
      (error: HttpErrorResponse): void => {
        this.error = error.error.error_description;
      }
    );
  }
}
