import { NgModule } from '@angular/core';
import { MaterialModule } from '@shared/material/material.module';
import { RouterModule } from '@angular/router';
import { AppFormsModule } from '@forms/forms.module';
import { PipesModule } from '@pipes/pipes.module';
import { DirectivesModule } from '@directives/directives.module';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from '@shared/modal/modal.module';

// Components

@NgModule({
  exports: [
    MaterialModule,
    RouterModule,
    AppFormsModule,
    DirectivesModule,
    PipesModule,
    SharedComponentsModule,
    ModalModule,
    TranslateModule
  ]
})
export class SharedModule {}
