import { PlainJSSpecifier } from '@utils/specifier/plain-js.specifier';
import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '@utils/helpers';
import * as child_process from 'child_process';

jest.mock('child_process');

describe('Plain JS specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: PlainJSSpecifier;

  beforeEach(() => {
    specifier = new PlainJSSpecifier(testDir);
  });

  test('extends from Specifier', () => {
    expect(specifier).toBeInstanceOf(Specifier);
  });

  describe('specify Plain JS project', () => {
    beforeEach(async (): Promise<void> => {
      mockClassMethods(specifier, [Specifier], ['specify']);

      await specifier.specify();
    });

    test('copy configs', async (): Promise<void> => {
      expect(specifier.copyConfigs).toBeCalled();
    });

    test('execute "npm i"', async (): Promise<void> => {
      expect(specifier.npmInstall).toBeCalledWith();
    });

    test('remove default Git repo', async (): Promise<void> => {
      expect(specifier.removeDefaultGit).toBeCalled();
    });

    test('init Git repo', async (): Promise<void> => {
      expect(specifier.initGit).toBeCalled();
    });

    test('Do init commit', async (): Promise<void> => {
      expect(specifier.initialCommit).toBeCalled();
    });
  });
});
