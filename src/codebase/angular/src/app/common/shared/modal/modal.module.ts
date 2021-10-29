import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { MaterialModule } from '@shared/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '@shared/modal/modal.service';
import { UserModalModule } from '@shared/modal/modals/user-modal/user-modal.module';

@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule, MaterialModule, TranslateModule, ReactiveFormsModule, UserModalModule],
  exports: [UserModalModule],
  providers: [ModalService]
})
export class ModalModule {}
