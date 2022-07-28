import { title } from '@utils/validators';
import { red } from 'ansi-colors';

describe('Validators can', () => {
  test('check title correct', () => {
    const errorMessage = red('Project name may only include letters, numbers, underscores and hashes.');
    expect(title()).toBe(errorMessage);
    expect(title('')).toBe(errorMessage);
    expect(title('project')).toBeTruthy();
    expect(title('project-name')).toBeTruthy();
    expect(title('project_name')).toBeTruthy();
    expect(title('project/name')).toBe(errorMessage);
    expect(title('project name')).toBe(errorMessage);
  });
});
