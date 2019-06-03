import * as projects from '../index';
import * as cli from '@angular/cli';
import * as specifier from  '../../utils/specifier';

jest.mock('fs-extra');
jest.mock('@angular/cli');

describe('Generate angular project', () => {
  const projectName = 'angular-project-test';

  test('can run angular cli', () => {
    Object.defineProperty(cli, 'default', {value: jest.fn()});
    specifier.angular.editAngularJson = jest.fn();

    projects.angularProject({title: projectName});
    expect(cli.default).toHaveBeenCalled();
  });

  test('should throw an Error without "title" property', () => {
    Object.defineProperty(cli, 'default', {value: jest.fn()});

    expect(projects.angularProject()).rejects.toThrow();
    expect(cli.default).not.toHaveBeenCalled();
  });

  describe('should call', () => {
    beforeAll(() => {
      specifier.angular.editAngularJson = jest.fn();
      specifier.angular.copyDotHtaccess = jest.fn();
      specifier.angular.copyTsconfig = jest.fn();
      Object.defineProperty(specifier, 'copyEditorconfig', {value: jest.fn()});
      Object.defineProperty(specifier, 'copyStylelintrc', {value: jest.fn()});

      return projects.angularProject({title: projectName});
    });

    test('editAngularJson with project title', () => {
      expect(specifier.angular.editAngularJson).toHaveBeenCalledWith(projectName);
    });

    test('copyAngularDotHtaccess with project title', () => {
      expect(specifier.angular.copyDotHtaccess).toHaveBeenCalledWith(projectName);
    });

    test('copyAngularTsconfig with project title', () => {
      expect(specifier.angular.copyTsconfig).toHaveBeenCalledWith(projectName);
    });

    test('copyEditorconfig with project title', () => {
      expect(specifier.copyEditorconfig).toHaveBeenCalledWith(projectName);
    });

    test('copyStylelintrc with project title', () => {
      expect(specifier.copyStylelintrc).toHaveBeenCalledWith(projectName);
    });
  });
});
