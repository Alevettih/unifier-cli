import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePreloadDirective } from '@directives/image-preload/image-preload.directive';
import { ClickOutsideDirective } from '@directives/click-outside/click-outside.directive';
import { ShowForRolesDirective } from '@directives/show-for-roles/show-for-roles.directive';
import { ImagePlaceholderDirective } from '@directives/image-placeholder/image-placeholder.directive';

@NgModule({
  declarations: [ImagePlaceholderDirective, ClickOutsideDirective, ShowForRolesDirective, ImagePreloadDirective],
  exports: [ImagePlaceholderDirective, ClickOutsideDirective, ShowForRolesDirective, ImagePreloadDirective],
  imports: [CommonModule]
})
export class DirectivesModule {}
