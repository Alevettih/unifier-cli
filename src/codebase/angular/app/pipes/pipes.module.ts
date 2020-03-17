import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeofPipe } from '@pipes/typeof/typeof.pipe';
import { PathParsePipe } from '@pipes/path-parse/path-parse.pipe';
import { PathToNamePipe } from '@pipes/path-to-name/path-to-name.pipe';

@NgModule({
  declarations: [TypeofPipe, PathParsePipe, PathToNamePipe],
  exports: [TypeofPipe, PathParsePipe, PathToNamePipe],
  imports: [CommonModule],
  providers: [PathParsePipe, TypeofPipe, PathToNamePipe]
})
export class PipesModule {}
