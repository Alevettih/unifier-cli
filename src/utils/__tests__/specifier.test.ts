import { Specifier } from '../specifier';
import * as fs from 'fs-extra';
import * as execa from 'execa';
import { join } from 'path';

jest.mock('fs-extra');

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
        async (usedPackageManager, yarn): Promise<void> => {
          const context = {
            usedPackageManager,
            yarn
          };
          Object.defineProperty(specifier, 'usedPackageManager', {
            value: jest.fn(async ctx => Object.assign(ctx, context))
          });
          Object.defineProperty(specifier, 'isYarnAvailable', {
            value: jest.fn(async ctx => Object.assign(ctx, context))
          });

          await specifier.installPackages().run();
          expect(execa.command).toBeCalledWith('yarn install', specifier.childProcessOptions);

          await specifier.installPackages(['test']).run();
          expect(execa.command).toBeCalledWith('yarn add test --dev', specifier.childProcessOptions);
        }
      );
    });

    describe('by npm', () => {
      test.each([[null, false], ['npm', false], ['npm', true], ['yarn', false]])(
        'if usedPackageManager === %s and isYarnAvailable === %s',
        async (usedPackageManager, yarn): Promise<void> => {
          const context = {
            usedPackageManager,
            yarn
          };
          Object.defineProperty(specifier, 'usedPackageManager', {
            value: jest.fn(async ctx => Object.assign(ctx, context))
          });
          Object.defineProperty(specifier, 'isYarnAvailable', {
            value: jest.fn(async ctx => Object.assign(ctx, context))
          });

          await specifier.installPackages().run();
          expect(execa.command).toBeCalledWith('yarn install', specifier.childProcessOptions);

          await specifier.installPackages(['test']).run();
          expect(execa.command).toBeCalledWith('yarn add test --dev', specifier.childProcessOptions);
        }
      );
    });
  });

  test('merge object with .json file', async (): Promise<void> => {
    const fakePath = join(specifier.name, 'fake/path/to.json');
    Object.defineProperty(fs, 'readJsonSync', { value: jest.fn(() => ({ a: 1 })) });
    Object.defineProperty(fs, 'writeJson', {
      value: jest
        .fn()
        .mockRejectedValueOnce({})
        .mockResolvedValue({})
    });
    await expect(specifier.mergeWithJson(fakePath, { b: 2 })).rejects.toThrow();

    expect(fs.writeJson).toBeCalledWith(fakePath, { a: 1, b: 2 }, { spaces: 2 });
  });

  test('update .gitignore rules', async (): Promise<void> => {
    Object.defineProperty(fs, 'readFileSync', {
      value: jest
        .fn()
        .mockReturnValueOnce('node_modules/\ndist/')
        .mockReturnValueOnce('fake_directory/\ndist/')
    });
    Object.defineProperty(fs, 'outputFile', {
      value: jest
        .fn()
        .mockRejectedValueOnce({})
        .mockResolvedValue({})
    });
    await expect(specifier.updateGitignoreRules()).rejects.toThrow();

    expect(fs.outputFile).toBeCalledWith(
      join(specifier.name, '.gitignore'),
      'node_modules/\ndist/\nfake_directory/',
      'utf-8'
    );
  });

  test('copy configs', async (): Promise<void> => {
    await specifier.copyConfigs({ src: '', dist: '' }, { src: '', dist: '' }).run();
    expect(fs.copy).toBeCalledTimes(2);
  });

  test('remove default Git', async (): Promise<void> => {
    Object.defineProperty(execa, 'command', {
      value: jest
        .fn()
        .mockRejectedValueOnce({})
        .mockResolvedValue({})
    });
    await expect(specifier.removeDefaultGit()).rejects.toThrow();

    expect(execa.command).toBeCalledWith('rm -rf .git', specifier.childProcessOptions);
  });

  test('init Git repo', async (): Promise<void> => {
    Object.defineProperty(execa, 'command', {
      value: jest
        .fn()
        .mockRejectedValueOnce({})
        .mockResolvedValue({})
    });
    await expect(specifier.initGit()).rejects.toThrow();

    expect(execa.command).toBeCalledWith('git init', specifier.childProcessOptions);
  });

  test('add config.js', async (): Promise<void> => {
    Object.defineProperty(fs, 'outputFile', {
      value: jest
        .fn()
        .mockRejectedValueOnce({})
        .mockResolvedValue({})
    });
    await expect(specifier.addConfigJs()).rejects.toThrow();

    expect(fs.outputFile).toBeCalled();
  });

  test('add link to config js in html', async (): Promise<void> => {
    Object.defineProperty(fs, 'readFileSync', { value: jest.fn(() => '<title>Test</title>') });

    Object.defineProperty(fs, 'outputFile', {
      value: jest
        .fn()
        .mockRejectedValueOnce({})
        .mockResolvedValue({})
    });
    await expect(specifier.addLinkToConfigJsInHtml()).rejects.toThrow();

    expect(fs.readFileSync).toBeCalled();
    expect(fs.outputFile).toBeCalledWith(
      join(specifier.name, 'public/index.html'),
      '<title>Test</title>\n    <script src="./config.js"></script>',
      'utf-8'
    );
  });

  test('Do initial commit', async (): Promise<void> => {
    Object.defineProperty(execa, 'command', {
      value: jest
        .fn()
        .mockRejectedValueOnce({})
        .mockResolvedValue({})
    });
    await expect(specifier.initialCommit()).rejects.toThrow();

    expect(execa.command).toBeCalledWith('git add .; git commit -m "Initial commit" -n', specifier.childProcessOptions);
  });

  test('should check yarn availability', async (): Promise<void> => {
    const ctx = {};
    await specifier.isYarnAvailable(ctx);

    expect(execa.command).toBeCalledWith('npm list -g --depth=0 | grep yarn', specifier.childProcessOptions);
    expect(ctx).toHaveProperty('yarn');

    Object.defineProperty(execa, 'command', { value: jest.fn(async () => Promise.reject()) });
    await specifier.isYarnAvailable(ctx);
    expect(ctx).toMatchObject({ yarn: false });

    Object.defineProperty(execa, 'command', { value: jest.fn(async () => Promise.resolve()) });
    await specifier.isYarnAvailable(ctx);
    expect(ctx).toMatchObject({ yarn: true });
  });

  describe('should handle currently used package manager', () => {
    test.each([[true, false, 'npm'], [false, true, 'yarn'], [true, true, 'yarn'], [false, false, null]])(
      'if package-lock.json exists === %s and yarn.lock exists === %s, should return %s',
      (npm, yarn, result): void => {
        const ctx = {};
        specifier.usedPackageManager(ctx);

        expect(fs.existsSync).toBeCalledWith(join(specifier.name, 'package-lock.json'));
        expect(fs.existsSync).toBeCalledWith(join(specifier.name, 'yarn.lock'));

        Object.defineProperty(fs, 'existsSync', {
          value: jest
            .fn()
            .mockReturnValueOnce(npm)
            .mockReturnValueOnce(yarn)
        });

        specifier.usedPackageManager(ctx);
        expect(ctx).toMatchObject({ usedPackageManager: result });
      }
    );
  });
});
