import { sep } from 'path';

export function getCWD(): string {
  return process.cwd().split(sep).pop();
}
