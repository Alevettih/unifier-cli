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

export function typeOf(item: unknown, type: typeOfAvailableType): boolean {
  let isTypeMatched: boolean;

  if (type.includes('strict-object')) {
    isTypeMatched = item && typeof item === 'object' && !Array.isArray(item);
  } else if (type.includes('null')) {
    isTypeMatched = !item && typeof item === 'object' && !(item instanceof Object);
  } else if (type.includes('array')) {
    isTypeMatched = item && Array.isArray(item);
  } else if (type.includes('integer')) {
    isTypeMatched = Number.isInteger(item);
  } else {
    isTypeMatched = typeof item === type.split('-').slice(-1)[0];
  }

  return type.includes('not-') ? !isTypeMatched : isTypeMatched;
}
