import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { AppFormsModule } from '@forms/forms.module';
import { ConfirmModalComponent } from '@modals/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [ConfirmModalComponent],
  entryComponents: [ConfirmModalComponent],
  imports: [CommonModule, MaterialModule, AppFormsModule]
})
export class ModalsModule {}
