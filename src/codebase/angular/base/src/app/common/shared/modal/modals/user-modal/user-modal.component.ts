import { Component, Input, OnInit } from '@angular/core';
import { IModalComponentContext, ModalComponent } from '@shared/modal/modal.component';
import { User } from '@models/classes/user/user.model';
import { BaseFormAbstractComponent } from '@misc/abstracts/base-form.abstract.component';
import { FormBuilder, Validators } from '@angular/forms';
import { UserRole } from '@models/enums/user-role.enum';
import { IOption } from '@models/interfaces/forms/option.interface';
import { VALIDATORS_SET } from '@misc/constants/validators-set.constant';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';
import { difference } from '@misc/helpers/difference.function';

interface IFormValues {
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
}

@Component({
  selector: 'user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent extends BaseFormAbstractComponent implements OnInit {
  @Input() context: IModalComponentContext<User>;
  roleOptions: IOption[] = [];
  private readonly _AVAILABLE_ROLES: UserRole[] = [UserRole.admin];

  get user(): User {
    return this.context?.entity;
  }

  get defaultValues(): IFormValues {
    return {
      firstName: this.user?.firstName ?? '',
      lastName: this.user?.lastName ?? '',
      email: this.user?.email ?? '',
      role: this.user?.role
    };
  }

  get dialog(): MatDialogRef<ModalComponent<User>> {
    return this.context?.dialog;
  }

  constructor(private _translate: TranslateService, private _fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this._initOptions();
    this._initForm();
  }

  getModalResult(): IFormValues {
    return difference(this.formGroup.getRawValue(), this.defaultValues) as IFormValues;
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.dialog.close(this.getModalResult());
  }

  private _initForm(): void {
    this.formGroup = this._fb.group({
      firstName: this._fb.control(this.defaultValues?.firstName, Validators.compose([Validators.required, VALIDATORS_SET.NAME])),
      lastName: this._fb.control(this.defaultValues?.lastName, Validators.compose([Validators.required, VALIDATORS_SET.NAME])),
      email: this._fb.control(this.defaultValues?.email, Validators.compose([Validators.required, VALIDATORS_SET.EMAIL])),
      role: this._fb.control(this.defaultValues?.role)
    });
  }

  private _initOptions(): void {
    this.roleOptions = this._AVAILABLE_ROLES.map(
      (role: UserRole): IOption => ({ value: role, label: this._translate.instant(`SERVICE_ROLE.${role.toUpperCase()}`), disabled: false })
    );
  }
}
