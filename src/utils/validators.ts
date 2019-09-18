import { red } from 'colors/safe';

export function title(input?: string): boolean | string {
  if (input && /^([A-Za-z\-\_\d])+$/.test(input)) {
    if (input !== 'test') {
      return true;
    }
    return red('"test" is incorrect project name');
  } else {
    return red('Project name may only include letters, numbers, underscores and hashes.');
  }
}
