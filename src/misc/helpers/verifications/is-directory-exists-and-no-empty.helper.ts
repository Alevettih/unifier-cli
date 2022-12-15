import { pathExistsSync } from 'fs-extra';
import { readdirSync } from 'fs';

export function isDirectoryExistsAndNotEmpty(input?: string): boolean {
  return !!(pathExistsSync(input) && readdirSync(input).length);
}
