import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalActionsComponent } from '@shared/modal/modal-actions/modal-actions.component';
import { MaterialModule } from '@shared/material/material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ModalActionsComponent],
  imports: [CommonModule, MaterialModule, TranslateModule],
  exports: [ModalActionsComponent]
})
export class ModalActionsModule {}
