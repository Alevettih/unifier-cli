import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material/material.module';
import { DirectivesModule } from '@directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, RouterModule, MaterialModule, DirectivesModule, TranslateModule]
})
export class NotificationModule {}
