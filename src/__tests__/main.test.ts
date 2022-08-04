import main, { args } from '@src/main';
import * as fs from 'fs-extra';
import * as projects from '@src/project-types';
import { isDirectoryExistsAndNotEmpty } from '@utils/helpers';
import { join } from 'path';

jest.mock('@src/project-types/angular.project');
jest.mock('@src/project-types/plain.project');
jest.mock('fs-extra');
jest.mock('@utils/helpers');

describe('User answers', () => {
  describe('can select correct project type', () => {
    const title = 'test-test';

    test('should throw error with invalid project type', async () => {
      args.title = title;
      // @ts-ignore
      args.type = 'test';

      await expect(main()).rejects.toThrow(Error);
    });

    test('Plain JS', async () => {
      args.title = title;
      args.type = projects.types.PLAIN;

      await main();

      expect(projects.plainProject).toHaveBeenCalled();
    });

    test('Angular', async () => {
      args.title = title;
      args.type = projects.types.ANGULAR;
      args.version = '14';

      await main();

      expect(projects.angularProject).toHaveBeenCalled();
    });

    test('if selected directory is already exists and not empty it should clean it', async () => {
      args.title = 'same';
      args.isYarnAvailable = false;
      args.packageManager = 'npm';
      args.type = projects.types.PLAIN;

      await main();

      expect(isDirectoryExistsAndNotEmpty).toBeCalled();
      expect(isDirectoryExistsAndNotEmpty(args.title)).toBeTruthy();
      expect(fs.remove).toBeCalledWith(join(args.title));
    });
  });
});
