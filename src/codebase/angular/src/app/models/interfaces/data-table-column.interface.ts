import { TemplateRef } from '@angular/core';

export interface IDataTableColumn {
  columnName: string;
  title?: string;
  template?: TemplateRef<any>;
}
