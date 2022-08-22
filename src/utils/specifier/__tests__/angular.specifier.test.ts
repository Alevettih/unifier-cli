import { AngularSpecifier } from '@utils/specifier/angular.specifier';
import { Specifier } from '@utils/specifier';
import * as fs from 'fs-extra';
import { args } from '@src/main';
import { getConfigsPaths } from '@utils/helpers/getters/get-configs-paths.helper';
import { mockClassMethods } from '@utils/helpers/mock-class-methods.helper';
import { ProjectType } from '@src/project-types';
import { getDependencies, getDevDependencies } from '@utils/helpers/getters/get-dependencies.helper';

jest.mock('child_process');
jest.mock('fs-extra');

describe('Angular specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: AngularSpecifier;

  beforeEach(() => {
    args.title = testDir;
    args.type = ProjectType.ANGULAR;
    args.applications = ['client', 'admin'];
    specifier = new AngularSpecifier(args);
  });

  test('extends from Specifier', () => {
    expect(specifier).toBeInstanceOf(Specifier);
  });

  test('remove default .browserslistrc before copy configs from specification', async (): Promise<void> => {
    await specifier.copyConfigs(...getConfigsPaths(args.type, args.title)).run(args);

    expect(fs.copy).toBeCalledTimes(getConfigsPaths(args.type, args.title).length);
  });

  test('copy base structure of Angular project', async (): Promise<void> => {
    await specifier.copyBaseStructure(args);

    expect(fs.copy).toBeCalled();

    Object.defineProperty(fs, 'copySync', { value: jest.fn().mockRejectedValueOnce({}) });
    await expect(specifier.copyBaseStructure(args)).resolves.toBe(undefined);
  });

  test('add tokens to assets', async (): Promise<void> => {
    await specifier.addTokensToAssets(args);

    expect(fs.outputFile).toBeCalled();

    Object.defineProperty(fs, 'outputFile', { value: jest.fn().mockRejectedValueOnce({}) });
    await expect(specifier.addTokensToAssets(args)).rejects.toThrow();
  });

  describe('specify Angular project', () => {
    beforeEach(async (): Promise<void> => {
      mockClassMethods(specifier, [Specifier, AngularSpecifier], ['specify']);

      await specifier.specify().run(args);
    });

    test('copy configs', async (): Promise<void> => {
      expect(specifier.copyConfigs).toBeCalled();
    });

    test('copy base structure from codebase', async (): Promise<void> => {
      expect(specifier.copyBaseStructure).toBeCalled();
    });

    test('install dependencies', async (): Promise<void> => {
      expect(specifier.installPackages).toBeCalledWith(getDependencies(), getDevDependencies(false));
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
