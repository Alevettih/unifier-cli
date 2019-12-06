import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NormalizePipe } from '@pipes/normalize.pipe';
import { IsPipe } from '@pipes/is.pipe';
import { PathParsePipe } from '@pipes/path-parse.pipe';

@NgModule({
  declarations: [NormalizePipe, IsPipe, PathParsePipe],
  exports: [NormalizePipe, IsPipe, PathParsePipe],
  imports: [CommonModule],
  providers: [PathParsePipe, IsPipe]
})
export class PipesModule {}
