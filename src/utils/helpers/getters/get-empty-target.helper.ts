export function getEmptyTarget(value: any): any {
  return Array.isArray(value) ? [] : {};
}
