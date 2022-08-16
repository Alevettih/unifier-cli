import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseAutocompleteComponent } from './base-autocomplete.component';

@NgModule({
  declarations: [BaseAutocompleteComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [BaseAutocompleteComponent]
})
export class BaseAutocompleteModule {}
