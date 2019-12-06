export class Entity {
  [key: string]: any;

  constructor(data) {
    this.onInit(data, this.setPropertiesToModel);
  }

  static convertDataToModel(value: any, Model: any) {
    if (value && typeof value === 'object') {
      return new Model(value);
    } else {
      return value;
    }
  }

  protected setPropertiesToModel(key: string, data: any) {
    this[key] = data[key];
  }

  private onInit(data: any, callback: (key: string, data: any) => void) {
    try {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          callback.apply(this, [key, data]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export class List {
  entities: Entity[];
  total: number;

  constructor({ entities = [], total = 0 }, entityClass) {
    this.entities = entities.map((entity: Entity) => new entityClass(entity));
    this.total = total;
  }
}
