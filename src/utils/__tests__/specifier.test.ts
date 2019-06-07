import { Specifier } from '../specifier';
import * as fs from 'fs-extra';
import * as child_process from 'child_process';

jest.mock('fs-extra');
jest.mock('child_process');

describe('Specifier should', () => {
  const testDir = 'target-tmp';

  test('init an instance', () => {
    expect(() => new Specifier('')).toThrow();
    expect(() => new Specifier(testDir)).not.toThrow();
    expect(new Specifier(testDir)).toBeInstanceOf(Specifier);
    expect(new Specifier(testDir).project).toBe(testDir);
    expect(new Specifier(testDir).childProcessOptions).toBeInstanceOf(Object);
  });

  test('copy .editorconfig file from specification', () => {
    const specifier = new Specifier(testDir);

    return specifier.copyEditorconfig().then(() => {
      expect(fs.copy).toBeCalled();
    });
  });

  test('copy .browserslistrc file from specification', () => {
    const specifier = new Specifier(testDir);

    Object.defineProperty(fs, 'readJsonSync', {value: jest.fn().mockReturnValue({browserslist: {test: 2}})});

    return specifier.copyBrowserslistrc().then(() => {
      expect(fs.readJsonSync).toBeCalled();
      expect(fs.writeJson).toBeCalled();
      expect(fs.copy).toBeCalled();
    });
  });

  test('copy .stylelintrc file from specification', () => {
    const specifier = new Specifier(testDir);

    Object.defineProperty(fs, 'readJsonSync', {value: jest.fn().mockReturnValue({scripts: {}})});

    return specifier.copyStylelintrc().then(() => {
      expect(child_process.spawn).toBeCalled();

      expect(fs.readJsonSync).toBeCalled();
      expect(fs.writeJson).toBeCalled();
      expect(fs.copy).toBeCalled();
    });
  });
});
