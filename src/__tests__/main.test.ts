import main from '@src/main';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import * as projects from '@src/project-types';
import { isDirectoryExistsAndNotEmpty } from '@utils/helpers';

jest.mock('@src/project-types/angular.project');
jest.mock('@src/project-types/plain.project');
jest.mock('inquirer');
jest.mock('fs-extra');
jest.mock('@utils/helpers');

describe('User answers', () => {
  test('can call inquirer', async (): Promise<void> => {
    Object.defineProperty(inquirer, 'prompt', { value: jest.fn(async () => {}) });
    await main();
    expect(inquirer.prompt).toHaveBeenCalled();
  });

  describe('can select correct project type', () => {
    const title = 'test-test';

    test('Plain JS', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(async () => ({ title, type: projects.types.PLAIN }))
      });

      await main();

      expect(inquirer.prompt).toHaveBeenCalled();
      expect(projects.plainProject).toHaveBeenCalled();
    });

    test('Angular', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(async () => ({ title, type: projects.types.ANGULAR, version: 'latest' }))
      });

      await main();

      expect(inquirer.prompt).toHaveBeenCalled();
      expect(projects.angularProject).toHaveBeenCalled();
    });

    test('should throw TypeError with invalid project type', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(async () => ({ title, type: null }))
      });

      await main();

      expect(inquirer.prompt).toHaveBeenCalled();
      expect(main()).resolves.toThrow(Error);
    });

    test('should throw Error without project name', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(async () => ({ title: null }))
      });

      await main();

      expect(inquirer.prompt).toHaveBeenCalled();
      await expect(main()).resolves.toThrow(Error);
    });

    test('if selected directory is already exists and not empty it should clean it', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(async () => ({ title: 'same' }))
      });

      await main();

      expect(isDirectoryExistsAndNotEmpty).toBeCalled();
      expect(fs.remove).toBeCalled();
    });
  });
});
