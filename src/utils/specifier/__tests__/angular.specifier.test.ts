import { AngularSpecifier } from '@utils/specifier/angular.specifier';
import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '@utils/helpers';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import * as angularJsonAdditions from '@specification/files/angular/angular.json';
import { join } from 'path';

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

  test('remove default .browserslistrc before copy it from specification', async (): Promise<void> => {
    await specifier.copyBrowserslistrc();

    expect(fs.remove).toBeCalled();
    expect(fs.copy).toBeCalled();
  });

  test('copy base structure of Angular project', async (): Promise<void> => {
    await specifier.copyBaseStructure();

    expect(fs.copy).toBeCalled();
  });

  test('edit angular.json', async (): Promise<void> => {
    Object.defineProperty(fs, 'readJsonSync', { value: jest.fn(() => ({}))});

    await specifier.editAngularJson();

    expect(fs.readJsonSync).toBeCalled();
    expect(fs.writeJson).toBeCalledWith(
      join(specifier.name, 'angular.json'),
      { projects: {[specifier.name]: angularJsonAdditions} },
      { spaces: 2 }
    );
  });

  test('copy tsconfig.json from specification', async (): Promise<void> => {
    await specifier.copyTsconfig();

    expect(fs.copy).toBeCalled();
  });

  test('copy .htaccess from specification', async (): Promise<void> => {
    await specifier.copyHtaccess();

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
      expect(specifier.copyHtaccess).toBeCalled();
      expect(specifier.copyBrowserslistrc).toBeCalled();
      expect(specifier.copyTsconfig).toBeCalled();
      expect(specifier.copyEditorconfig).toBeCalled();
      expect(specifier.copyStylelintrc).toBeCalled();
    });

    test('copy base structure from codebase', async (): Promise<void> => {
      expect(specifier.copyBaseStructure).toBeCalled();
    });

    test('add stylelint task to package.json', async (): Promise<void> => {
      expect(specifier.addStylelintTaskToPackageJson).toBeCalled();
    });

    test('edit angular.json', async (): Promise<void> => {
      expect(specifier.editAngularJson).toBeCalled();
    });

    test('add lint hooks', async (): Promise<void> => {
      expect(specifier.addLintHooks).toBeCalled();
    });

    test('execute "npm i"', async (): Promise<void> => {
      expect(specifier.npmInstall).toBeCalledWith(['husky', ...specifier.stylelint.modules]);
    });

    test('init Git repo', async (): Promise<void> => {
      expect(specifier.initGit).toBeCalled();
    });

    test('Do init commit', async (): Promise<void> => {
      expect(specifier.initialCommit).toBeCalled();
    });
  });
});
