import { ClassConstructor } from 'class-transformer';
import { convertToModelsArrayFunction } from '@misc/helpers/model-conversion/convert-to-models-array.function';

export interface IListEntry<T = any> {
  'hydra:member'?: T[];
  'hydra:totalItems'?: number;
  entities?: T[];
  total?: number;
}

export class List<T = any> {
  entities: T[];
  total: number;

  constructor(listEntry: IListEntry<T>, entityClass: ClassConstructor<T>) {
    let items: T[];
    let count: number;

    switch (true) {
      case Array.isArray(listEntry):
        items = listEntry as T[];
        count = (listEntry as T[])?.length;
        break;
      case Boolean(listEntry?.['hydra:member']) && Boolean(listEntry?.['hydra:totalItems']):
        items = listEntry['hydra:member'];
        count = listEntry['hydra:totalItems'];
        break;
      default:
        items = [];
        count = 0;
    }

    this.entities = convertToModelsArrayFunction(items, entityClass);
    this.total = count;
  }
}
