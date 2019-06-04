import { sep } from 'path';
import { pathExistsSync } from 'fs-extra';
import { readdirSync } from 'fs';

export function isDirectoryExistsAndNotEmpty(input?: string): boolean {
  return !!(pathExistsSync(input) && readdirSync(input).length);
}

export function getCWD(): string {
  return process.cwd().split(sep).pop();
}

export function isObject(item: any): boolean {
  return !!(item && typeof item === 'object' && !Array.isArray(item));
}

export function deepMerge(target: object, ...sources: object[]): object {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}
