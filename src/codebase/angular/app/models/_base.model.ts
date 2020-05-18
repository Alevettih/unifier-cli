import { convertToModel } from '@misc/helpers';
import { ClassType } from 'class-transformer/ClassTransformer';

export interface Entity {
  [key: string]: any;
}

export class List<T = any> {
  entities: T[];
  total: number;

  constructor({ entities = [], total = 0 }: List<T> = { entities: [], total: 0 }, entityClass: ClassType<T>) {
    this.entities = entities.map((entity: T): T => convertToModel(entity, entityClass));
    this.total = total;
  }
}
