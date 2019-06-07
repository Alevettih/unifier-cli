import main from '../main';
import * as projects from '../project-types';
import * as inquirer from 'inquirer';

jest.mock('inquirer');
jest.mock('fs-extra');

describe('User answers', () => {
  test('can call inquirer', () => {

    Object.defineProperty(inquirer, 'prompt', {value: jest.fn(async () => { return; })});
    main();
    expect(inquirer.prompt).toHaveBeenCalled();
  });

  describe('can select correct project type', () => {
    const title = 'test-test';

    beforeAll(() => {
      Object.defineProperty(projects, 'plainProject', {value: jest.fn()});
      Object.defineProperty(projects, 'angularProject', {value: jest.fn()});
      Object.defineProperty(projects, 'reactProject', {value: jest.fn()});
      Object.defineProperty(projects, 'vueProject', {value: jest.fn()});
    });

    test('Plain JS', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(
          async () => ({ title, type: projects.types.PLAIN })
        )
      });

      await main();

      expect(projects.plainProject).toHaveBeenCalled();
    });

    test('Angular', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(
          async () => ({ title, type: projects.types.ANGULAR })
        )
      });

      await main();

      expect(projects.angularProject).toHaveBeenCalled();
    });

    test('React', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(
          async () => ({ title, type: projects.types.REACT })
        )
      });

      await main();

      expect(projects.reactProject).toHaveBeenCalled();
    });

    test('Vue', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(
          async () => ({ title, type: projects.types.VUE })
        )
      });

      await main();

      expect(projects.vueProject).toHaveBeenCalled();
    });

    test('should throw TypeError with invalid project type', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(
          async () => ({ title, type: null })
        )
      });

      await main();

      expect(inquirer.prompt).toHaveBeenCalled();
      expect(main()).resolves.toThrow(TypeError);
    });
  });
});
