import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePreloadDirective } from '@directives/image-preload.directive';
import { ClickOutsideDirective } from '@directives/click-outside.directive';
import { CopyClipboardDirective } from '@directives/copy-clipboard.directive';

@NgModule({
  declarations: [ImagePreloadDirective, CopyClipboardDirective, ClickOutsideDirective],
  exports: [ImagePreloadDirective, CopyClipboardDirective, ClickOutsideDirective],
  imports: [CommonModule]
})
export class DirectivesModule {}
