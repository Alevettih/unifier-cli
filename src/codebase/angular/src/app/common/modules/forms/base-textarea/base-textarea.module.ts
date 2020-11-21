import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { BaseTextareaComponent } from './base-textarea.component';

@NgModule({
  declarations: [BaseTextareaComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, PipesModule, RouterModule],
  exports: [BaseTextareaComponent]
})
export class BaseTextareaModule {}
