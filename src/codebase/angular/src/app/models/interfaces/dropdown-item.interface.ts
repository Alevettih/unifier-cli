import { TemplateRef } from '@angular/core';

export interface IDropdownItem<T> {
  content: T;
  template: TemplateRef<any>;
}
