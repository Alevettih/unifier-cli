import { plainToClass } from 'class-transformer';

export interface Entity {
  [key: string]: any;
}

export class List<T> {
  entities: T[];
  total: number;

  constructor({ entities = [], total = 0 } = {}, entityClass) {
    this.entities = entities.map((entity: T) => plainToClass(entityClass, entity));
    this.total = total;
  }
}
