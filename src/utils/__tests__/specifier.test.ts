import { Specifier } from '../specifier';
import * as fs from 'fs-extra';
import * as child_process from 'child_process';
import { join } from 'path';

jest.mock('fs-extra');
jest.mock('child_process');

describe('Specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: Specifier;

  beforeEach(() => {
    specifier = new Specifier(testDir);
  });

  test('init an instance', (): void => {
    expect(() => new Specifier('')).toThrow();
    expect(() => new Specifier(testDir)).not.toThrow();
    expect(specifier).toBeInstanceOf(Specifier);
    expect(specifier.project).toBe(testDir);
    expect(specifier.childProcessOptions).toBeInstanceOf(Object);
  });

  test('copy .editorconfig file from specification', async (): Promise<void> => {
    await specifier.copyEditorconfig();

    expect(fs.copy).toBeCalled();
  });

  test('copy .browserslistrc file from specification', async (): Promise<void> => {
    Object.defineProperty(fs, 'readJsonSync', { value: jest.fn().mockReturnValue({ browserslist: { test: 2 } }) });

    await specifier.copyBrowserslistrc();

    expect(fs.readJsonSync).toBeCalled();
    expect(fs.writeJson).toBeCalledWith(
      join(specifier.name, 'package.json'),
      { browserslist: undefined },
      { spaces: 2 }
    );
    expect(fs.copy).toBeCalled();
  });

  test('init .stylelintrc', async (): Promise<void> => {
    Object.defineProperty(fs, 'readJsonSync', {value: jest.fn().mockReturnValue({scripts: {}})});

    await specifier.copyStylelintrc();

    expect(child_process.spawn).toBeCalledWith(
      'npm',
      ['i', ...specifier.stylelint.modules],
      specifier.childProcessOptions
    );
    expect(fs.readJsonSync).toBeCalled();
    expect(fs.writeJson).toBeCalledWith(
      join(specifier.name, 'package.json'),
      { scripts: { 'lint:scss': specifier.stylelint.script } },
      { spaces: 2 }
    );
    expect(fs.copy).toBeCalled();
  });

  test('init .eslintrc', async (): Promise<void> => {
    Object.defineProperty(fs, 'readJsonSync', {value: jest.fn().mockReturnValue({scripts: {}})});

    await specifier.copyEslintrc();

    expect(child_process.spawn).toBeCalledWith(
      'npm',
      ['i', ...specifier.eslint.modules],
      specifier.childProcessOptions
    );
    expect(fs.readJsonSync).toBeCalled();
    expect(fs.writeJson).toBeCalledWith(
      join(specifier.name, 'package.json'),
      { scripts: { 'lint:es': specifier.eslint.script } },
      { spaces: 2 }
    );
    expect(fs.copy).toBeCalled();
  });

  test('Create Git repo', async (): Promise<void> => {
    await specifier.initGit();

    expect(child_process.spawn).toBeCalledWith(
      'git init',
      Object.assign({shell: true}, specifier.childProcessOptions)
    );
  });

  test('Do initial commit', async (): Promise<void> => {
    await specifier.initialCommit();

    expect(child_process.spawn).toBeCalledWith(
      'git add .; git commit -m "Initial commit" -n',
      Object.assign({shell: true}, specifier.childProcessOptions)
    );
  });
});
