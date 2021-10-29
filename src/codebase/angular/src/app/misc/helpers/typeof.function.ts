type typeOfBaseType =
  | 'undefined'
  | 'object'
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'function'
  | 'strict-object'
  | 'null'
  | 'array'
  | 'integer';

type typeOfInvertedType = `not-${typeOfBaseType}`;

export type typeOfAvailableType = typeOfBaseType | typeOfInvertedType;

export function typeOf(item: any, type: typeOfAvailableType): boolean {
  let res: boolean;

  if (type.includes('strict-object')) {
    res = item && typeof item === 'object' && !Array.isArray(item);
  } else if (type.includes('null')) {
    res = !item && typeof item === 'object' && !(item instanceof Object);
  } else if (type.includes('array')) {
    res = item && Array.isArray(item);
  } else if (type.includes('integer')) {
    res = Number.isInteger(item);
  } else {
    res = typeof item === type.split('-').slice(-1)[0];
  }

  return type.includes('not-') ? !res : res;
}
