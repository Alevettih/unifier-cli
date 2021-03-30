import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { AppFormsModule } from '@forms/forms.module';
import { MessageModalComponent } from '@modals/message-modal/message-modal.component';

@NgModule({
  declarations: [MessageModalComponent],
  entryComponents: [MessageModalComponent],
  imports: [CommonModule, MaterialModule, AppFormsModule]
})
export class ModalsModule {}
