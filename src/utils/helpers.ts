import { sep } from 'path';
import { pathExistsSync } from 'fs-extra';
import { readdirSync } from 'fs';
import { ChildProcess } from 'child_process';
import { Specifier } from "@utils/specifier";
import { VueSpecifier } from "@specifier/vue.specifier";

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

export function childProcessPromise(childProcess: ChildProcess): Promise<any> {
  return new Promise((resolve, reject) => {
    childProcess.on('exit', resolve);
    childProcess.on('error', reject);
  });
}

export function mockClassMethods(target, classes, excludedMethods) {
  const isNotExcluded = (key) => {
    return ['constructor', ...excludedMethods].every(excludedValue => key !== excludedValue);
  };

  classes.forEach(classInstance => {
    Object.getOwnPropertyNames(classInstance.prototype).forEach(key => {
      if (isNotExcluded(key) && typeof target[key] === 'function') {
        target[key] = jest.fn(async () => {});
      }
    });
  });
}
