import { TemplateRef } from '@angular/core';
import { SortDirection } from '@angular/material/sort';

export interface IDataTableColumn {
  columnName: string;
  title?: string;
  sortable?: boolean;
  template?: TemplateRef<any>;
  sort?: {
    name?: string;
    defaultDirection?: SortDirection;
  };
}
