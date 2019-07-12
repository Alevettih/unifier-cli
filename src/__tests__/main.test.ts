import main from '@src/main';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import * as projects from '@src/project-types';
import { isDirectoryExistsAndNotEmpty } from '../utils/helpers';

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

    beforeAll(() => {
      Object.defineProperty(projects, 'plainProject', { value: jest.fn(async () => {}) });
      Object.defineProperty(projects, 'angularProject', { value: jest.fn(async () => {}) });
      Object.defineProperty(projects, 'reactProject', { value: jest.fn(async () => {}) });
      Object.defineProperty(projects, 'vueProject', { value: jest.fn(async () => {}) });
    });

    test('Plain JS', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(async () => ({ title, type: projects.types.PLAIN }))
      });

      await main();

      expect(projects.plainProject).toHaveBeenCalled();
    });

    test('Angular', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(async () => ({ title, type: projects.types.ANGULAR }))
      });

      await main();

      expect(projects.angularProject).toHaveBeenCalled();
    });

    test('React', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(async () => ({ title, type: projects.types.REACT }))
      });

      await main();

      expect(projects.reactProject).toHaveBeenCalled();
    });

    test('Vue', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(async () => ({ title, type: projects.types.VUE }))
      });

      await main();

      expect(projects.vueProject).toHaveBeenCalled();
    });

    test('should throw TypeError with invalid project type', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(async () => ({ title, type: null }))
      });

      await main();

      expect(inquirer.prompt).toHaveBeenCalled();
      expect(main()).resolves.toThrow(TypeError);
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
