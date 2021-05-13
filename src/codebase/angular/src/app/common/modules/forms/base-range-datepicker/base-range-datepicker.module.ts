import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { BaseRangeDatepickerComponent } from './base-range-datepicker.component';

@NgModule({
  declarations: [BaseRangeDatepickerComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, PipesModule, RouterModule],
  exports: [BaseRangeDatepickerComponent]
})
export class BaseRangeDatepickerModule {}
