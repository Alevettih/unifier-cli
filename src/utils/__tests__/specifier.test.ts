import { Specifier } from '../specifier';
import * as fs from 'fs-extra';
import * as execa from 'execa';
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

  describe('install dependencies', () => {
    describe('by yarn', () => {
      test.each([[null, true], ['yarn', true]])(
        'if usedPackageManager is %s and isYarnAvailable is %s',
        async (usedPackageManager, isYarnAvailable): Promise<void> => {
          Object.defineProperty(specifier, 'usedPackageManager', { value: jest.fn(async () => usedPackageManager) });
          Object.defineProperty(specifier, 'isYarnAvailable', { value: jest.fn(async () => isYarnAvailable) });

          await specifier.installPackages();
          expect(execa.command).toBeCalledWith('yarn install', specifier.childProcessOptions);

          await specifier.installPackages(['test']);
          expect(execa.command).toBeCalledWith('yarn add test --dev', specifier.childProcessOptions);
        }
      );
    });

    describe('by npm', () => {
      test.each([[null, false], ['npm', false], ['npm', true], ['yarn', false]])(
        'if usedPackageManager is %s and isYarnAvailable is %s',
        async (usedPackageManager, isYarnAvailable): Promise<void> => {
          Object.defineProperty(specifier, 'usedPackageManager', { value: jest.fn(async () => usedPackageManager) });
          Object.defineProperty(specifier, 'isYarnAvailable', { value: jest.fn(async () => isYarnAvailable) });

          await specifier.installPackages();
          expect(execa.command).toBeCalledWith('yarn install', specifier.childProcessOptions);

          await specifier.installPackages(['test']);
          expect(execa.command).toBeCalledWith('yarn add test --dev', specifier.childProcessOptions);
        }
      );
    });
  });

  test('merge object with .json file', async (): Promise<void> => {
    const fakePath = join(specifier.name, 'fake/path/to.json');
    Object.defineProperty(fs, 'readJsonSync', { value: jest.fn(() => ({ a: 1 })) });

    await specifier.mergeWithJson(fakePath, { b: 2 });

    expect(fs.writeJson).toBeCalledWith(fakePath, { a: 1, b: 2 }, { spaces: 2 });
  });

  test('update .gitignore rules', async (): Promise<void> => {
    Object.defineProperty(fs, 'readFileSync', {
      value: jest
        .fn()
        .mockReturnValueOnce('node_modules/\ndist/')
        .mockReturnValueOnce('fake_directory/\ndist/')
    });

    await specifier.updateGitignoreRules();

    expect(fs.outputFile).toBeCalledWith(
      join(specifier.name, '.gitignore'),
      'node_modules/\ndist/\nfake_directory/',
      'utf-8'
    );
  });

  test('copy configs', async (): Promise<void> => {
    await specifier.copyConfigs({ src: '', dist: '' }, { src: '', dist: '' });
    expect(fs.copy).toBeCalledTimes(2);
  });

  test('remove default Git', async (): Promise<void> => {
    await specifier.removeDefaultGit();

    expect(execa.command).toBeCalledWith('rm -rf .git', specifier.childProcessOptions);
  });

  test('init Git repo', async (): Promise<void> => {
    await specifier.initGit();

    expect(execa.command).toBeCalledWith('git init', specifier.childProcessOptions);
  });

  test('add config.js', async (): Promise<void> => {
    await specifier.addConfigJs();

    expect(fs.outputFile).toBeCalled();
  });

  test('add link to config js in html', async (): Promise<void> => {
    Object.defineProperty(fs, 'readFileSync', { value: jest.fn(() => '<title>Test</title>') });

    await specifier.addLinkToConfigJsInHtml();

    expect(fs.readFileSync).toBeCalled();
    expect(fs.outputFile).toBeCalledWith(
      join(specifier.name, 'public/index.html'),
      '<title>Test</title>\n    <script src="./config.js"></script>',
      'utf-8'
    );
  });

  test('Do initial commit', async (): Promise<void> => {
    await specifier.initialCommit();

    expect(execa.command).toBeCalledWith('git add .; git commit -m "Initial commit" -n', specifier.childProcessOptions);
  });

  test('should check yarn availability', async (): Promise<void> => {
    await specifier.isYarnAvailable();

    expect(execa.command).toBeCalledWith('npm list -g --depth=0 | grep yarn', specifier.childProcessOptions);
  });

  test('should handle currently used package manager', async (): Promise<void> => {
    await specifier.usedPackageManager();

    const options = Object.assign({ reject: false }, specifier.childProcessOptions);

    expect(execa.command).toBeCalledWith('ls -la | grep package-lock.json', options);
    expect(execa.command).toBeCalledWith('ls -la | grep yarn.lock', options);
  });
});
