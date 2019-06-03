import main from '../main';
import * as projects from '../project-types';
import * as inquirer from 'inquirer';
import * as fs from "fs";

jest.mock('inquirer');
jest.mock('fs-extra');

describe('User answers', () => {
  test('can call inquirer', () => {

    Object.defineProperty(inquirer, 'prompt', {value: jest.fn(async () => {return;})});
    main();
    expect(inquirer.prompt).toHaveBeenCalled();
  });

  describe('can select correct project type', () => {
    beforeAll(() => {
      Object.defineProperty(projects, 'plain', {value: jest.fn()});
      Object.defineProperty(projects, 'angular', {value: jest.fn()});
      Object.defineProperty(projects, 'react', {value: jest.fn()});
      Object.defineProperty(projects, 'vue', {value: jest.fn()});
    });

    test('Plain JS', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(
          async () => ({ type: projects.types.PLAIN })
        )
      });

      await main();

      expect(projects.plainProject).toHaveBeenCalled();
    });

    test('Angular', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(
          async () => ({ type: projects.types.ANGULAR })
        )
      });

      await main();

      expect(projects.angularProject).toHaveBeenCalled();
    });

    test('React', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(
          async () => ({ type: projects.types.REACT })
        )
      });

      await main();

      expect(projects.reactProject).toHaveBeenCalled();
    });

    test('Vue', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(
          async () => ({ type: projects.types.VUE })
        )
      });

      await main();

      expect(projects.vueProject).toHaveBeenCalled();
    });

    test('should throw TypeError with invalid project type', async () => {
      Object.defineProperty(inquirer, 'prompt', {
        value: jest.fn(
          async () => ({ type: null })
        )
      });

      await main();

      expect(inquirer.prompt).toHaveBeenCalled();
      expect(main()).resolves.toThrow(TypeError);
    });
  });
});
