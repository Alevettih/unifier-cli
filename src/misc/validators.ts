import { OutputFormatter } from '@helpers/output-formatter.helper';

export class Validators {
  static title(input?: string): boolean | string {
    if (input && /^([A-Za-z\-_\d])+$/.test(input)) {
      if (input !== 'test') {
        return true;
      }
      return OutputFormatter.warning('"test" is incorrect project name');
    } else {
      return OutputFormatter.warning('Project name may only include letters, numbers, underscores and hashes.');
    }
  }

  static minLength(min: number) {
    return (items?: string[]): boolean | string => {
      if (items?.length >= min) {
        return true;
      } else {
        return OutputFormatter.warning(`Please, select at least ${min} option.`);
      }
    };
  }
}
