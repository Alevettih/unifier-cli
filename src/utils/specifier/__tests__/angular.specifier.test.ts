import { AngularSpecifier } from '@utils/specifier/angular.specifier';
import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '@utils/helpers';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import config from '@utils/specifier/configs/angular.config';
import { IContext } from '@src/main';

jest.mock('child_process');
jest.mock('fs-extra');

describe('Angular specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: AngularSpecifier;

  beforeEach(() => {
    specifier = new AngularSpecifier({ title: testDir } as IContext);
  });

  test('extends from Specifier', () => {
    expect(specifier).toBeInstanceOf(Specifier);
  });

  test('remove default .browserslistrc before copy configs from specification', async (): Promise<void> => {
    await specifier.copyConfigs(...config.getConfigsPaths(testDir)).run();

    expect(fs.copy).toBeCalledTimes(config.getConfigsPaths(testDir).length);
  });

  test('copy base structure of Angular project', async (): Promise<void> => {
    await specifier.copyBaseStructure({ title: testDir } as IContext);

    expect(fs.copy).toBeCalled();

    Object.defineProperty(fs, 'copy', { value: jest.fn().mockRejectedValueOnce({}) });
    expect(specifier.copyBaseStructure({ title: testDir } as IContext)).rejects.toThrow();
  });

  test('add token.json to assets', async (): Promise<void> => {
    await specifier.addTokenJsonToAssets({ title: testDir } as IContext);

    expect(fs.outputFile).toBeCalled();

    Object.defineProperty(fs, 'outputFile', { value: jest.fn().mockRejectedValueOnce({}) });
    expect(specifier.addTokenJsonToAssets({ title: testDir } as IContext)).rejects.toThrow();
  });

  describe('specify Angular project', () => {
    beforeEach(async (): Promise<void> => {
      mockClassMethods(specifier, [Specifier, AngularSpecifier], ['specify']);

      await specifier.specify().run();
    });

    test('copy configs', async (): Promise<void> => {
      expect(specifier.copyConfigs).toBeCalled();
    });

    test('copy base structure from codebase', async (): Promise<void> => {
      expect(specifier.copyBaseStructure).toBeCalled();
    });

    test('install dependencies', async (): Promise<void> => {
      expect(specifier.installPackages).toBeCalledWith(config.dependencies, config.devDependencies(false));
    });

    test('Run Prettier', async (): Promise<void> => {
      expect(specifier.runPrettier).toBeCalled();
    });

    test('Run Linters', async (): Promise<void> => {
      expect(specifier.lintersTask).toBeCalled();
    });

    test('Do init commit with amend', async (): Promise<void> => {
      expect(specifier.initialCommit).toBeCalledWith(true);
    });
  });
});
