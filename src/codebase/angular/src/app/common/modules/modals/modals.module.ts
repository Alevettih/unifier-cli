import { NgModule } from '@angular/core';
import { MessageModalModule } from '@modals/message-modal/message-modal.module';
import { FormModalModule } from '@modals/form-modal/form-modal.module';

@NgModule({
  exports: [MessageModalModule, FormModalModule]
})
export class ModalsModule {}
