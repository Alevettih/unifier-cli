import { PlainJSSpecifier } from '@utils/specifier/plain-js.specifier';
import { Specifier } from '@utils/specifier';
import * as fs from 'fs-extra';
import { args } from '@src/main';
import { mockClassMethods } from '@utils/helpers/mock-class-methods.helper';
import { ProjectType } from '@src/project-types';

jest.mock('child_process');
jest.mock('fs-extra');

describe('Plain JS specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: PlainJSSpecifier;

  beforeEach(() => {
    args.title = testDir;
    args.type = ProjectType.PLAIN;
    specifier = new PlainJSSpecifier(args);
  });

  test('extends from Specifier', () => {
    expect(specifier).toBeInstanceOf(Specifier);
  });

  describe('specify Plain JS project', () => {
    beforeEach(async (): Promise<void> => {
      mockClassMethods(specifier, [Specifier], ['specify']);

      await specifier.specify().run(args);
    });

    test('copy configs', async (): Promise<void> => {
      expect(specifier.copyConfigs).toBeCalled();
    });

    test('install dependencies', async (): Promise<void> => {
      expect(specifier.installPackages).toBeCalledWith();
    });

    test('remove default Git repo', async (): Promise<void> => {
      expect(fs.removeSync).toBeCalled();
    });

    test('init Git repo', async (): Promise<void> => {
      expect(specifier.initGit).toBeCalled();
    });

    test('Run Prettier', async (): Promise<void> => {
      expect(specifier.runPrettier).toBeCalled();
    });

    test('Run Linters', async (): Promise<void> => {
      expect(specifier.lintersTask).toBeCalled();
    });

    test('Do init commit without amend', async (): Promise<void> => {
      expect(specifier.initialCommit).toBeCalledWith();
      expect(specifier.initialCommit).not.toBeCalledWith(true);
    });
  });
});
