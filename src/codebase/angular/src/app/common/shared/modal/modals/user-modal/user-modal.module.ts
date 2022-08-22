import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModalComponent } from './user-modal.component';
import { AppFormsModule } from '@forms/forms.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@shared/material/material.module';
import { ModalActionsModule } from '@shared/modal/modal-actions/modal-actions.module';

@NgModule({
  declarations: [UserModalComponent],
  imports: [CommonModule, AppFormsModule, MaterialModule, TranslateModule, ModalActionsModule],
  exports: [UserModalComponent]
})
export class UserModalModule {}
