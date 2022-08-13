import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeofPipe } from '@pipes/typeof/typeof.pipe';
import { PathParsePipe } from '@pipes/path-parse/path-parse.pipe';
import { PrettifyUrlPipe } from './prettify-url/prettify-url.pipe';

@NgModule({
  declarations: [TypeofPipe, PathParsePipe, PrettifyUrlPipe],
  exports: [TypeofPipe, PathParsePipe, PrettifyUrlPipe],
  imports: [CommonModule],
  providers: [PathParsePipe, TypeofPipe, PrettifyUrlPipe]
})
export class PipesModule {}
