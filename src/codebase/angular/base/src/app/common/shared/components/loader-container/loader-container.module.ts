import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { RouterModule } from '@angular/router';
import { AppFormsModule } from '@forms/forms.module';
import { DirectivesModule } from '@directives/directives.module';
import { PipesModule } from '@pipes/pipes.module';
import { LoaderContainerComponent } from './loader-container.component';

@NgModule({
  declarations: [LoaderContainerComponent],
  imports: [CommonModule, MaterialModule, RouterModule, AppFormsModule, DirectivesModule, PipesModule],
  exports: [LoaderContainerComponent]
})
export class LoaderContainerModule {}
