import { AngularSpecifier } from '@utils/specifier/angular.specifier';
import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '../../helpers';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import config from '@utils/specifier/configs/angular.config';

jest.mock('child_process');
jest.mock('fs-extra');

describe('Angular specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: AngularSpecifier;

  beforeEach(() => {
    specifier = new AngularSpecifier(testDir);
  });

  test('extends from Specifier', () => {
    expect(specifier).toBeInstanceOf(Specifier);
  });

  test('remove default .browserslistrc before copy configs from specification', async (): Promise<void> => {
    await specifier.copyConfigs(...config.getConfigsPaths(specifier.name)).run();

    expect(fs.removeSync).toBeCalled();
    expect(fs.copy).toBeCalledTimes(config.getConfigsPaths(specifier.name).length);
  });

  test('copy base structure of Angular project', async (): Promise<void> => {
    await specifier.copyBaseStructure();

    expect(fs.copy).toBeCalled();

    Object.defineProperty(fs, 'copy', { value: jest.fn().mockRejectedValueOnce({}) });
    expect(specifier.copyBaseStructure()).rejects.toThrow();
  });

  test('add token.json to assets', async (): Promise<void> => {
    await specifier.addTokenJsonToAssets();

    expect(fs.outputFile).toBeCalled();

    Object.defineProperty(fs, 'outputFile', { value: jest.fn().mockRejectedValueOnce({}) });
    expect(specifier.addTokenJsonToAssets()).rejects.toThrow();
  });

  describe('specify Angular project', () => {
    beforeEach(
      async (): Promise<void> => {
        mockClassMethods(specifier, [Specifier, AngularSpecifier], ['specify']);

        await specifier.specify().run();
      }
    );

    test('copy configs', async (): Promise<void> => {
      expect(specifier.copyConfigs).toBeCalled();
    });

    test('copy base structure from codebase', async (): Promise<void> => {
      expect(specifier.copyBaseStructure).toBeCalled();
    });

    test('install dependencies', async (): Promise<void> => {
      expect(specifier.installPackages).toBeCalledWith(config.modules);
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
