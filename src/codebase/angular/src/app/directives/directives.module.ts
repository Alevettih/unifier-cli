import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '@directives/click-outside/click-outside.directive';
import { ShowForRolesDirective } from '@directives/show-for-roles/show-for-roles.directive';
import { DndFileDirective } from '@directives/dnd-file/dnd-file.directive';
import { ImagePlaceholderDirective } from '@directives/image-placeholder/image-placeholder.directive';
import { NativeElementInjectorDirective } from '@directives/native-element-injector/native-element-injector.directive';
import { HasPermissionsDirective } from '@directives/has-permissions/has-permissions.directive';

@NgModule({
  declarations: [
    ImagePlaceholderDirective,
    ClickOutsideDirective,
    ShowForRolesDirective,
    HasPermissionsDirective,
    DndFileDirective,
    NativeElementInjectorDirective
  ],
  exports: [
    ImagePlaceholderDirective,
    ClickOutsideDirective,
    ShowForRolesDirective,
    HasPermissionsDirective,
    DndFileDirective,
    NativeElementInjectorDirective
  ],
  imports: [CommonModule]
})
export class DirectivesModule {}
