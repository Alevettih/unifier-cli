import { VueSpecifier } from '@utils/specifier/vue.specifier';
import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '../../helpers';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import config from '@utils/specifier/configs/vue.config';

jest.mock('child_process');
jest.mock('fs-extra');

describe('Vue specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: VueSpecifier;

  beforeEach(() => {
    specifier = new VueSpecifier(testDir);
  });

  test('extends from Specifier', () => {
    expect(specifier).toBeInstanceOf(Specifier);
  });

  test('remove .eslintrc.js before copy configs from specification', async (): Promise<void> => {
    await specifier.copyConfigs(...config.getConfigsPaths(specifier.name));

    expect(fs.removeSync).toBeCalled();
    expect(fs.copy).toBeCalledTimes(config.getConfigsPaths(specifier.name).length);
  });

  describe('specify Vue project', () => {
    beforeEach(
      async (): Promise<void> => {
        mockClassMethods(specifier, [Specifier, VueSpecifier], ['specify']);

        await specifier.specify();
      }
    );

    test('copy configs', async (): Promise<void> => {
      expect(specifier.copyConfigs).toBeCalled();
    });

    test('add runtime config', async (): Promise<void> => {
      expect(specifier.addConfigJs).toBeCalled();
      expect(specifier.addLinkToConfigJsInHtml).toBeCalled();
    });

    test('install dependencies', async (): Promise<void> => {
      expect(specifier.installPackages).toBeCalledWith(config.modules);
    });

    test('Do init commit with amend', async (): Promise<void> => {
      expect(specifier.initialCommit).toBeCalledWith(true);
    });
  });
});
