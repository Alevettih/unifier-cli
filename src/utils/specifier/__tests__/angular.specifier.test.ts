import { AngularSpecifier } from '@utils/specifier/angular.specifier';
import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '@utils/helpers';
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
    await specifier.copyConfigs(...config.getConfigsPaths(specifier.name));

    expect(fs.remove).toBeCalled();
    expect(fs.copy).toBeCalledTimes(config.getConfigsPaths(specifier.name).length);
  });

  test('copy base structure of Angular project', async (): Promise<void> => {
    await specifier.copyBaseStructure();

    expect(fs.copy).toBeCalled();
  });

  test('add config.json to assets', async (): Promise<void> => {
    await specifier.addConfigJsonToAssets();

    expect(fs.outputFile).toBeCalled();

    Object.defineProperty(fs, 'outputFile', {value: jest.fn(() => Promise.reject())});

    expect(specifier.addConfigJsonToAssets).toThrowError();
  });

  describe('specify Angular project', () => {
    beforeEach(async (): Promise<void> => {
      mockClassMethods(specifier, [Specifier, AngularSpecifier], ['specify']);

      await specifier.specify();
    });

    test('copy configs', async (): Promise<void> => {
      expect(specifier.copyConfigs).toBeCalled();
    });

    test('copy base structure from codebase', async (): Promise<void> => {
      expect(specifier.copyBaseStructure).toBeCalled();
    });

    test('execute "npm i"', async (): Promise<void> => {
      expect(specifier.npmInstall).toBeCalledWith(config.modules);
    });

    test('init Git repo', async (): Promise<void> => {
      expect(specifier.initGit).toBeCalled();
    });

    test('Do init commit', async (): Promise<void> => {
      expect(specifier.initialCommit).toBeCalled();
    });
  });
});
