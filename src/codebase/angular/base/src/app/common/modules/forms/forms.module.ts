import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseTextareaModule } from '@forms/base-textarea/base-textarea.module';
import { BaseBooleanFieldModule } from './base-boolean-field/base-boolean-field.module';
import { BaseDatepickerModule } from './base-datepicker/base-datepicker.module';
import { BaseRangeDatepickerModule } from './base-range-datepicker/base-range-datepicker.module';
import { BaseInputModule } from './base-input/base-input.module';
import { BaseSelectModule } from './base-select/base-select.module';
import { FileUploaderModule } from '@forms/file-uploader/file-uploader.module';
import { BaseAutocompleteModule } from '@forms/base-autocomplete/base-autocomplete.module';

@NgModule({
  exports: [
    FormsModule,
    ReactiveFormsModule,
    BaseInputModule,
    BaseBooleanFieldModule,
    BaseDatepickerModule,
    BaseRangeDatepickerModule,
    BaseSelectModule,
    BaseTextareaModule,
    BaseAutocompleteModule,
    FileUploaderModule
  ]
})
export class AppFormsModule {}
