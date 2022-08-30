import { Validators } from '@utils/validators';
import { red } from 'ansi-colors';

describe('Validators can', () => {
  test('check title correct', () => {
    const errorMessage = red('Project name may only include letters, numbers, underscores and hashes.');
    expect(Validators.title()).toBe(errorMessage);
    expect(Validators.title('')).toBe(errorMessage);
    expect(Validators.title('project')).toBeTruthy();
    expect(Validators.title('project-name')).toBeTruthy();
    expect(Validators.title('project_name')).toBeTruthy();
    expect(Validators.title('project/name')).toBe(errorMessage);
    expect(Validators.title('project name')).toBe(errorMessage);
  });
  test('check minLength', () => {
    const errorMessage = red(`Please, select at least 1 option.`);
    expect(Validators.minLength(0)([])).toBeTruthy();
    expect(Validators.minLength(1)([])).toBe(errorMessage);
    expect(Validators.minLength(1)(['client'])).toBeTruthy();
    expect(Validators.minLength(1)(['client', 'admin'])).toBeTruthy();
  });
});
