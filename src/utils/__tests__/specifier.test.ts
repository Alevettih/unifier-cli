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

  test('execute "npm i" with passed modules', async (): Promise<void> => {
    specifier.npmInstall();
    expect(child_process.spawn).toBeCalledWith('npm', ['i'], specifier.childProcessOptions);

    specifier.npmInstall(['test']);
    expect(child_process.spawn).toBeCalledWith('npm', ['i', 'test'], specifier.childProcessOptions);
  });

  test('copy .editorconfig file from specification', async (): Promise<void> => {
    await specifier.copyEditorconfig();
    expect(fs.copy).toBeCalled();
  });

  test('copy .browserslistrc file from specification', async (): Promise<void> => {
    await specifier.copyBrowserslistrc();
    expect(fs.copy).toBeCalled();
  });

  test('add stylelint task to package.json', async (): Promise<void> => {
    Object.defineProperty(fs, 'readJsonSync', {value: jest.fn().mockReturnValue({scripts: {}})});

    await specifier.addStylelintTaskToPackageJson();

    expect(fs.readJsonSync).toBeCalled();
    expect(fs.writeJson).toBeCalledWith(
      join(specifier.name, 'package.json'),
      { scripts: { 'lint:scss': specifier.stylelint.script } },
      { spaces: 2 }
    );
  });

  test('copy .stylelintrc', async (): Promise<void> => {
    await specifier.copyStylelintrc();
    expect(fs.copy).toBeCalled();
  });

  test('add eslint task to package.json', async (): Promise<void> => {
    Object.defineProperty(fs, 'readJsonSync', {value: jest.fn().mockReturnValue({scripts: {}})});

    await specifier.addEslintTaskToPackageJson();

    expect(fs.readJsonSync).toBeCalled();
    expect(fs.writeJson).toBeCalledWith(
      join(specifier.name, 'package.json'),
      { scripts: { 'lint:es': specifier.eslint.script } },
      { spaces: 2 }
    );
  });

  test('copy .eslintrc', async (): Promise<void> => {
    await specifier.copyEslintrc();
    expect(fs.copy).toBeCalled();
  });

  test('remove default Git', async (): Promise<void> => {
    await specifier.removeDefaultGit();

    expect(child_process.spawn).toBeCalledWith('rm', ['-rf', '.git'], specifier.childProcessOptions);
  });

  test('init Git repo', async (): Promise<void> => {
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

  test('add pre-commit lint hooks', async (): Promise<void> => {
    const scripts = {
      'lint:es': '',
      'lint:scss': ''
    };
    const husky = {
      hooks: {
        'pre-commit': 'npm run lint:all'
      }
    };
    Object.defineProperty(fs, 'readJsonSync', {value: jest.fn().mockReturnValue({ scripts })});

    await specifier.addLintHooks();

    expect(fs.readJsonSync).toBeCalled();
    expect(fs.writeJson).toBeCalledWith(
      join(specifier.name, 'package.json'),
      { husky, scripts: Object.assign({ 'lint:all': 'npm run lint:es && npm run lint:scss' }, scripts) },
      { spaces: 2 }
    );
  });
});
