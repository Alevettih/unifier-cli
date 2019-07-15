import { Specifier } from '@utils/specifier';
import { mockClassMethods } from '../../helpers';
import * as child_process from 'child_process';
import { EmailSpecifier } from '../email.specifier';

jest.mock('child_process');

describe('Email specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: EmailSpecifier;

  beforeEach(() => {
    specifier = new EmailSpecifier(testDir);
  });

  test('extends from Specifier', () => {
    expect(specifier).toBeInstanceOf(Specifier);
  });

  describe('specify Email project', () => {
    beforeEach(
      async (): Promise<void> => {
        mockClassMethods(specifier, [Specifier], ['specify']);

        await specifier.specify().run();
      }
    );

    // test('copy configs', async (): Promise<void> => {
    //   expect(specifier.copyConfigs).toBeCalled();
    // });

    test('install dependencies', async (): Promise<void> => {
      expect(specifier.installPackages).toBeCalledWith();
    });

    test('remove default Git repo', async (): Promise<void> => {
      expect(specifier.removeDefaultGit).toBeCalled();
    });

    test('update .gitignore rules', async (): Promise<void> => {
      expect(specifier.updateGitignoreRules).toBeCalled();
    });

    test('init Git repo', async (): Promise<void> => {
      expect(specifier.initGit).toBeCalled();
    });

    test('Do init commit without amend', async (): Promise<void> => {
      expect(specifier.initialCommit).toBeCalledWith();
      expect(specifier.initialCommit).not.toBeCalledWith(true);
    });
  });
});
