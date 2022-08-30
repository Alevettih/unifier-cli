import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material/material.module';
import { DirectivesModule } from '@directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { GlobalConfig } from 'ngx-toastr/toastr/toastr-config';

const toastrConfig: Partial<GlobalConfig> = {
  positionClass: 'toast-top-right',
  toastComponent: NotificationComponent,
  progressBar: true,
  preventDuplicates: true,
  includeTitleDuplicates: true
};

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, ToastrModule.forRoot(toastrConfig), RouterModule, MaterialModule, DirectivesModule, TranslateModule]
})
export class NotificationModule {}
