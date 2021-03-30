export interface IFilteringItem<T = any> {
  key: string;
  translationKey: string;
  withHint: boolean;
  possibleValues?: T[];
  comparator?: (currentValue: T) => boolean;
  getNewFilterValue?: (currentValue: T) => T;
}
