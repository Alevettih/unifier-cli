import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CroppedTextComponent } from './cropped-text.component';
import { MaterialModule } from '@shared/material/material.module';

@NgModule({
  declarations: [CroppedTextComponent],
  exports: [CroppedTextComponent],
  imports: [CommonModule, MaterialModule]
})
export class CroppedTextModule {}
