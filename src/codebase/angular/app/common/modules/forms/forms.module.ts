import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@pipes/pipes.module';
import { BaseInputComponent } from '@forms/base-input/base-input.component';
import { MaterialModule } from '@shared/material/material.module';
import { BaseCheckboxComponent } from '@forms/base-checkbox/base-checkbox.component';

@NgModule({
  declarations: [BaseInputComponent, BaseCheckboxComponent],
  exports: [FormsModule, ReactiveFormsModule, BaseInputComponent, BaseCheckboxComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, PipesModule]
})
export class AppFormsModule {}
