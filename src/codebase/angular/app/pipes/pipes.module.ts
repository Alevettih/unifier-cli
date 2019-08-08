import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NormalizePipe } from '@pipes/normalize.pipe';
import { KeyValuePipe } from '@pipes/key-value.pipe';
import { IsPipe } from '@pipes/is.pipe';
import { PathParsePipe } from '@pipes/path-parse.pipe';

@NgModule({
  declarations: [NormalizePipe, KeyValuePipe, IsPipe, PathParsePipe],
  exports: [NormalizePipe, KeyValuePipe, IsPipe, PathParsePipe],
  imports: [CommonModule],
  providers: [PathParsePipe, KeyValuePipe, IsPipe]
})
export class PipesModule {}
