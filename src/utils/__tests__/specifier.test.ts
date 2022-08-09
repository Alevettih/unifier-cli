import * as fs from 'fs-extra';
import * as execa from 'execa';
import { join } from 'path';
import { IS_WINDOWS, shouldUseYarn } from '@utils/helpers';
import { Specifier } from '@utils/specifier';
import { args, IContext, PackageManager } from '@src/main';

jest.mock('fs-extra');

describe('Specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: Specifier;

  beforeEach(() => {
    args.title = testDir;
    specifier = new Specifier(args);
  });

  test('init an instance', (): void => {
    expect(() => new Specifier({ title: '' } as IContext)).toThrow();
    expect(() => new Specifier(args)).not.toThrow();
    expect(specifier).toBeInstanceOf(Specifier);
    expect(specifier.CHILD_PROCESS_OPTIONS).toBeInstanceOf(Object);
  });

  describe('install dependencies', () => {
    test.each([
      [null, false],
      ['npm', false],
      ['npm', true],
      ['yarn', false],
      ['yarn', true]
    ])(
      'if "packageManager" === %s and "isYarnAvailable" === %s',
      async (packageManager: PackageManager, isYarnAvailable: boolean): Promise<void> => {
        args.title = testDir;
        args.packageManager = packageManager;
        args.isYarnAvailable = isYarnAvailable;
        specifier = new Specifier(args);

        const isYarn: boolean = shouldUseYarn({ packageManager, isYarnAvailable } as IContext);
        const dependencies: string[] = ['test'];
        const devDependencies: string[] = ['dev-test'];

        await specifier.installPackages().run(args);
        expect(execa.command).toBeCalledWith(isYarn ? 'yarn install' : 'npm i', specifier.CHILD_PROCESS_OPTIONS);
        await specifier.installPackages(dependencies, devDependencies).run(args);
        expect(execa.command).toBeCalledWith(actualCommand(dependencies, false), specifier.CHILD_PROCESS_OPTIONS);
        expect(execa.command).toBeCalledWith(actualCommand(devDependencies, true), specifier.CHILD_PROCESS_OPTIONS);

        function actualCommand(packagesNames: string[], isDevDependencies: boolean): string {
          const installCommand: string = isYarn ? 'yarn add' : 'npm i';
          const flags: string = isYarn ? '--dev' : '--save-dev';

          return `${installCommand} ${packagesNames.join(' ')} ${isDevDependencies ? flags : ''}`.trim();
        }
      }
    );
  });

  test('merge object with .json file', async (): Promise<void> => {
    const fakePath = join(testDir, 'fake/path/to.json');
    Object.defineProperty(fs, 'readJsonSync', { value: jest.fn(() => ({ a: 1, c: [1, 2] })) });
    Object.defineProperty(fs, 'writeJson', {
      value: jest.fn().mockRejectedValueOnce({}).mockResolvedValue({})
    });
    await expect(specifier.mergeWithJson(fakePath, { b: 2, c: [3, 4] })).rejects.toThrow();

    expect(fs.writeJson).toBeCalledWith(fakePath, { a: 1, b: 2, c: [3, 4] }, { spaces: 2 });
  });

  test('update .gitignore rules', async (): Promise<void> => {
    Object.defineProperty(fs, 'readFileSync', {
      value: jest.fn().mockReturnValueOnce('node_modules/\ndist/').mockReturnValueOnce('fake_directory/\ndist/')
    });
    Object.defineProperty(fs, 'outputFile', {
      value: jest.fn().mockRejectedValueOnce({}).mockResolvedValue({})
    });
    await expect(specifier.updateGitignoreRules({ title: testDir } as IContext)).rejects.toThrow();

    expect(fs.outputFile).toBeCalledWith(join(testDir, '.gitignore'), 'node_modules/\ndist/\nfake_directory/', 'utf-8');
  });

  test('copy configs', async (): Promise<void> => {
    await specifier.copyConfigs({ src: '', dist: '' }, { src: '', dist: '' }).run();
    expect(fs.copy).toBeCalledTimes(2);
  });

  test('remove default Git', async (): Promise<void> => {
    Object.defineProperty(execa, 'command', {
      value: jest.fn().mockRejectedValueOnce({}).mockResolvedValue({})
    });
    await expect(specifier.removeDefaultGit()).rejects;

    const rmCommand: string = IS_WINDOWS ? 'del' : 'rm -rf';
    expect(execa.command).toBeCalledWith(`${rmCommand} .git`, specifier.CHILD_PROCESS_OPTIONS);
  });

  test('init Git repo', async (): Promise<void> => {
    Object.defineProperty(execa, 'command', {
      value: jest.fn().mockRejectedValueOnce({}).mockResolvedValue({})
    });
    await expect(specifier.initGit()).rejects;

    expect(execa.command).toBeCalledWith('git init', specifier.CHILD_PROCESS_OPTIONS);
  });

  test('Run prettier', async (): Promise<void> => {
    Object.defineProperty(execa, 'command', {
      value: jest.fn().mockRejectedValueOnce({}).mockResolvedValue({})
    });
    await expect(specifier.runPrettier()).rejects;

    expect(execa.command).toBeCalledWith(
      'node ./node_modules/prettier/bin-prettier "./src/**/*.{js,jsx,ts,tsx,html,vue}" --write',
      Object.assign({ preferLocal: true }, specifier.CHILD_PROCESS_OPTIONS)
    );
  });

  describe('Execute Linters task', () => {
    test('Get', async (): Promise<void> => {
      Object.defineProperty(specifier, 'getLinters', {
        value: jest.fn(async context => {
          Object.assign(context, { lintersKeys: [] });
        })
      });

      await specifier.lintersTask().run();

      expect(specifier.getLinters).toBeCalled();
    });

    describe('Run', () => {
      beforeEach(() => {
        Object.defineProperty(specifier, 'runLinters', { value: jest.fn(async () => null) });
      });

      test('Run if lint tasks is available', async (): Promise<void> => {
        Object.defineProperty(specifier, 'getLinters', {
          value: jest.fn(async context => {
            Object.assign(context, { lintersKeys: ['lint:scss'] });
          })
        });

        await specifier.lintersTask().run();

        expect(specifier.runLinters).toBeCalled();
      });

      test('Skip if lint tasks is unavailable', async (): Promise<void> => {
        Object.defineProperty(specifier, 'getLinters', {
          value: jest.fn(async context => {
            Object.assign(context, { lintersKeys: [] });
          })
        });

        await specifier.lintersTask().run();

        expect(specifier.runLinters).not.toBeCalled();
      });
    });
  });

  test('Get linters tasks names', async (): Promise<void> => {
    Object.defineProperty(fs, 'readJsonSync', {
      value: jest.fn().mockReturnValue({
        scripts: {
          'lint:scss': 'test',
          'lint:es': 'test',
          'lint:all': 'test',
          'lint:watch': 'test'
        }
      })
    });

    await specifier.getLinters(args);

    expect(args).toMatchObject({ lintersKeys: ['lint:scss', 'lint:es'] });
  });

  test('Run linters', async (): Promise<void> => {
    const ctx = { lintersKeys: ['lint:scss', 'lint:es'] } as IContext;
    Object.defineProperty(execa, 'command', {
      value: jest.fn().mockRejectedValueOnce({})
    });
    await expect(specifier.runLinters(ctx).run()).rejects.toThrow();

    Object.defineProperty(execa, 'command', {
      value: jest.fn(async () => null)
    });

    await specifier.runLinters(ctx).run();

    expect(execa.command).toBeCalledTimes(ctx.lintersKeys.length);
  });

  test('Do initial commit', async (): Promise<void> => {
    Object.defineProperty(execa, 'command', {
      value: jest.fn().mockRejectedValueOnce({}).mockResolvedValue({})
    });
    await expect(specifier.initialCommit()).rejects;

    expect(execa.command).toBeCalledWith(
      'git add .&& git commit -m "Initial commit" -n',
      specifier.CHILD_PROCESS_OPTIONS
    );

    await specifier.initialCommit(true);

    expect(execa.command).toBeCalledWith(
      'git add .&& git commit -m "Initial commit" -n --amend',
      specifier.CHILD_PROCESS_OPTIONS
    );
  });
});
