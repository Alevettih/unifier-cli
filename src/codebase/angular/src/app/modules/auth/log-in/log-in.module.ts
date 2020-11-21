import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogInComponent } from '@modules/auth/log-in/log-in.component';
import { RouterModule } from '@angular/router';
import { AppFormsModule } from '@forms/forms.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [LogInComponent],
  imports: [CommonModule, RouterModule, AppFormsModule, SharedModule],
  exports: [RouterModule]
})
export class LogInModule {}
