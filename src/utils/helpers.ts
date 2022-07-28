import { sep } from 'path';
import { pathExistsSync } from 'fs-extra';
import { readdirSync } from 'fs';
import * as deepMerge from 'deepmerge';
import { command } from 'execa';

export const IS_WINDOWS: boolean = process.platform === 'win32';

export async function getAngularInfo(): Promise<{ [key: string]: any }> {
  const commandRes = await command(`npm view @angular/cli --json`);
  return JSON.parse(commandRes.stdout);
}

export function isDirectoryExistsAndNotEmpty(input?: string): boolean {
  return !!(pathExistsSync(input) && readdirSync(input).length);
}

export function getCWD(): string {
  return process.cwd().split(sep).pop();
}

export function emptyTarget(value: any): any {
  return Array.isArray(value) ? [] : {};
}

export function clone(value: any, options: deepMerge.Options): object {
  return deepMerge(emptyTarget(value), value, options);
}

export function arrayMerge(target: any[], source: any[], options: deepMerge.Options): any[] {
  const destination = target.slice();

  source.forEach((e, i) => {
    if (typeof destination[i] === 'undefined') {
      const cloneRequested = options.clone !== false;
      const shouldClone = cloneRequested && options.isMergeableObject(e);

      destination[i] = shouldClone ? clone(e, options) : e;
    } else if (options.isMergeableObject(e)) {
      destination[i] = deepMerge(target[i], e, options);
    } else if (!target.includes(e)) {
      destination.push(e);
    }
  });

  return destination;
}

export function mockClassMethods(target: object, classes: any[], excludedMethods: string[]): void {
  const isNotExcluded = key => {
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

export const newlineSeparatedValue = {
  stringify(data: object = {}): string {
    const resArr = [];

    Object.keys(data).forEach((key: string): void => {
      if (key !== '_' && !resArr.includes(`\n# ${key}`)) {
        resArr.push(`\n# ${key}`);
      }

      data[key].forEach((value: string): void => {
        resArr.push(value);
      });
    });

    return [...new Set(resArr)].join('\n').trim();
  },
  parse(data: string = ''): object {
    const dataArr: string[] = data.split('\n');
    const res: object = {};

    let key = '_';

    dataArr.forEach((value: string): void => {
      if (!value) {
        return;
      }

      if (!res[key]) {
        res[key] = [];
      }

      if (value.includes('#')) {
        key = value.replace('# ', '');
      } else {
        res[key].push(value);
      }
    });

    return res;
  }
};
