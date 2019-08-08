import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePreloadDirective } from '@directives/image-preload.directive';

@NgModule({
  declarations: [ImagePreloadDirective],
  exports: [ImagePreloadDirective],
  imports: [CommonModule]
})
export class DirectivesModule {}
