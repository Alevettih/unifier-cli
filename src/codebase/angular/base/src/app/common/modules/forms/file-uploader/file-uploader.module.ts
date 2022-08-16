import { NgModule } from '@angular/core';
import { FileUploaderComponent } from './file-uploader.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CroppedTextModule } from '@shared/components/cropped-text/cropped-text.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [FileUploaderComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DirectivesModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    CroppedTextModule,
    MatProgressSpinnerModule
  ],
  exports: [FileUploaderComponent]
})
export class FileUploaderModule {}
