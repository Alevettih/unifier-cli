import { PlainJSSpecifier } from '@utils/specifier/plain-js.specifier';
import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '../../helpers';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import { Answer } from '@src/main';

jest.mock('child_process');
jest.mock('fs-extra');

describe('Plain JS specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: PlainJSSpecifier;

  beforeEach(() => {
    specifier = new PlainJSSpecifier({ title: testDir } as Answer);
  });

  test('extends from Specifier', () => {
    expect(specifier).toBeInstanceOf(Specifier);
  });

  describe('specify Plain JS project', () => {
    beforeEach(async (): Promise<void> => {
      mockClassMethods(specifier, [Specifier], ['specify']);

      await specifier.specify().run();
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
