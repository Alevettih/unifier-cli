import { ReactSpecifier } from '@utils/specifier/react.specifier';
import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '../../helpers';
import * as fs from 'fs-extra';
import * as child_process from 'child_process';
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
    Object.defineProperty(fs, 'readFileSync', { value: jest.fn(() => 'App.css index.css') });

    await specifier.cssToScss();

    expect(fs.rename).toBeCalledTimes(2);
    expect(fs.readFileSync).toBeCalledTimes(2);
    expect(fs.writeFile).toBeCalledTimes(2);
  });

  describe('specify React project', () => {
    beforeEach(
      async (): Promise<void> => {
        mockClassMethods(specifier, [Specifier, ReactSpecifier], ['specify']);

        await specifier.specify();
      }
    );

    test('add runtime config', async (): Promise<void> => {
      expect(specifier.addConfigJs).toBeCalled();
      expect(specifier.addLinkToConfigJsInHtml).toBeCalled();
    });

    test('copy configs', async (): Promise<void> => {
      expect(specifier.copyConfigs).toBeCalled();
    });

    test('install dependencies', async (): Promise<void> => {
      expect(specifier.installPackages).toBeCalledWith(config.modules);
    });

    test('Do init commit with amend', async (): Promise<void> => {
      expect(specifier.initialCommit).toBeCalledWith(true);
    });
  });
});
