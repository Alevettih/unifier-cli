import { TemplateRef } from '@angular/core';

export interface IDataTableColumn {
  columnName: string;
  title?: string;
  sortable?: boolean;
  template?: TemplateRef<any>;
}
