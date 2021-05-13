import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModalComponent } from './form-modal.component';
import { MaterialModule } from '@shared/material/material.module';
import { AppFormsModule } from '@forms/forms.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FormModalComponent],
  imports: [CommonModule, MaterialModule, AppFormsModule, TranslateModule],
  exports: [FormModalComponent]
})
export class FormModalModule {}
