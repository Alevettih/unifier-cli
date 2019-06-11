import { VueSpecifier } from '../vue.specifier';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';

jest.mock('child_process');
jest.mock('fs-extra');

describe('Vue specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: VueSpecifier;

  beforeEach(() => {
    specifier = new VueSpecifier(testDir);
  });

  test('remove .eslintrc.js and copy .eslintrc from specification', async (): Promise<void> => {
    await specifier.copyEslintrc();

    expect(fs.remove).toBeCalled();
    expect(fs.copy).toBeCalled();
  });

  describe('specify Vue project', () => {
    test('copy configs', async (): Promise<void> => {
      specifier.copyBrowserslistrc = jest.fn(async () => {});
      specifier.copyEditorconfig = jest.fn(async () => {});
      specifier.copyStylelintrc = jest.fn(async () => {});
      specifier.copyEslintrc = jest.fn(async () => {});

      await specifier.specify();

      expect(specifier.copyBrowserslistrc).toBeCalled();
      expect(specifier.copyEditorconfig).toBeCalled();
      expect(specifier.copyStylelintrc).toBeCalled();
      expect(specifier.copyEslintrc).toBeCalled();
    });

    test('execute "npm i"', async (): Promise<void> => {
      specifier.npmInstall = jest.fn(async () => {});

      await specifier.specify();

      expect(specifier.npmInstall).toBeCalledWith([...specifier.stylelint.modules]);
    });

    test('init Git repo', async (): Promise<void> => {
      specifier.initGit = jest.fn(async () => {});

      await specifier.specify();

      expect(specifier.initGit).toBeCalled();
    });

    test('Do init commit', async (): Promise<void> => {
      specifier.initialCommit = jest.fn(async () => {});

      await specifier.specify();

      expect(specifier.initialCommit).toBeCalled();
    });
  });
});
