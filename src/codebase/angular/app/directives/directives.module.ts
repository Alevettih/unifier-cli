import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePreloadDirective } from '@directives/image-preload/image-preload.directive';
import { ClickOutsideDirective } from '@directives/click-outside/click-outside.directive';
import { CopyToClipboardDirective } from '@directives/copy-to-clipboard/copy-to-clipboard.directive';

@NgModule({
  declarations: [ImagePreloadDirective, ClickOutsideDirective, CopyToClipboardDirective],
  exports: [ImagePreloadDirective, ClickOutsideDirective, CopyToClipboardDirective],
  imports: [CommonModule]
})
export class DirectivesModule {}
