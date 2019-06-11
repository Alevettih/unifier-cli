import { PlainJSSpecifier } from '../plain-js.specifier';
import * as child_process from 'child_process';

jest.mock('child_process');

describe('Plain JS specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: PlainJSSpecifier;

  beforeEach(() => {
    specifier = new PlainJSSpecifier(testDir);
  });

  describe('specify Plain JS project', () => {
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

      expect(specifier.npmInstall).toBeCalledWith();
    });

    test('remove default Git repo', async (): Promise<void> => {
      specifier.removeDefaultGit = jest.fn(async () => {});

      await specifier.specify();

      expect(specifier.removeDefaultGit).toBeCalled();
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
