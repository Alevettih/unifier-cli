import { ReactSpecifier } from '@utils/specifier/react.specifier';
import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '@utils/helpers';
import * as fs from 'fs-extra';
import * as child_process from 'child_process';
import { join } from 'path';
import config from '@utils/specifier/configs/react.config';

jest.mock('fs-extra');
jest.mock('child_process');

describe('react specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: ReactSpecifier;

  beforeEach(() => {
    specifier = new ReactSpecifier(testDir);
  });

  test('extends from Specifier', () => {
    expect(specifier).toBeInstanceOf(Specifier);
  });

  test('change css to scss', async (): Promise<void> => {
    Object.defineProperty(fs, 'readFile', {value: jest.fn(async () => 'App.css index.css')});

    await specifier.cssToScss();

    expect(fs.rename).toBeCalledTimes(2);
    expect(fs.readFile).toBeCalledTimes(2);
    expect(fs.writeFile).toBeCalledTimes(2);
  });

  describe('specify React project', () => {
    beforeEach(async (): Promise<void> => {
      mockClassMethods(specifier, [Specifier, ReactSpecifier], ['specify']);

      await specifier.specify();
    });

    test('add runtime config', async (): Promise<void> => {
      expect(specifier.addConfigJs).toBeCalled();
      expect(specifier.addLinkToConfigJsInHtml).toBeCalled();
    });

    test('copy configs', async (): Promise<void> => {
      expect(specifier.copyConfigs).toBeCalled();
    });

    test('execute "npm i"', async (): Promise<void> => {
      expect(specifier.npmInstall).toBeCalledWith(config.modules);
    });

    test('Do init commit', async (): Promise<void> => {
      expect(specifier.initialCommit).toBeCalled();
    });
  });
});
