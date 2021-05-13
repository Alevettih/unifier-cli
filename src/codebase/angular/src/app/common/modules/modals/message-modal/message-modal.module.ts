import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { AppFormsModule } from '@forms/forms.module';
import { TranslateModule } from '@ngx-translate/core';
import { MessageModalComponent } from './message-modal.component';

@NgModule({
  declarations: [MessageModalComponent],
  imports: [CommonModule, MaterialModule, AppFormsModule, TranslateModule],
  exports: [MessageModalComponent]
})
export class MessageModalModule {}
