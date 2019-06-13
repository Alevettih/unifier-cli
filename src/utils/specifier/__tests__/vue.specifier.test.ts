import { VueSpecifier } from '@utils/specifier/vue.specifier';
import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '@utils/helpers';
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

  test('extends from Specifier', () => {
    expect(specifier).toBeInstanceOf(Specifier);
  });

  test('remove .eslintrc.js and copy .eslintrc from specification', async (): Promise<void> => {
    await specifier.copyEslintrc();

    expect(fs.remove).toBeCalled();
    expect(fs.copy).toBeCalled();
  });

  describe('specify Vue project', () => {
    beforeEach(async (): Promise<void> => {
      mockClassMethods(specifier, [Specifier, VueSpecifier], ['specify']);

      await specifier.specify();
    });

    test('copy configs', async (): Promise<void> => {
      expect(specifier.copyBrowserslistrc).toBeCalled();
      expect(specifier.copyEditorconfig).toBeCalled();
      expect(specifier.copyStylelintrc).toBeCalled();
      expect(specifier.copyEslintrc).toBeCalled();
    });

    test('add runtime config', async (): Promise<void> => {
      expect(specifier.addConfigJs).toBeCalled();
      expect(specifier.addLinkToConfigJsInHtml).toBeCalled();
    });

    test('execute "npm i"', async (): Promise<void> => {
      expect(specifier.npmInstall).toBeCalledWith([...specifier.stylelint.modules]);
    });

    test('add stylelint task to package.json', async (): Promise<void> => {
      expect(specifier.addStylelintTaskToPackageJson).toBeCalled();
    });

    test('init Git repo', async (): Promise<void> => {
      expect(specifier.initGit).toBeCalled();
    });

    test('Do init commit', async (): Promise<void> => {
      expect(specifier.initialCommit).toBeCalled();
    });
  });
});
