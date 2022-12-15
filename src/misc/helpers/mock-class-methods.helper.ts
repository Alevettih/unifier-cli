export function mockClassMethods(target: object, classes: any[], excludedMethods: string[]): void {
  const isNotExcluded = (key: string): boolean => {
    return ['constructor', ...excludedMethods].every((excludedValue: string): boolean => key !== excludedValue);
  };

  classes.forEach((classInstance: any): void => {
    Object.getOwnPropertyNames(classInstance.prototype).forEach((key: string): void => {
      if (isNotExcluded(key) && typeof target[key] === 'function') {
        target[key] = jest.fn(async () => undefined);
      }
    });
  });
}
