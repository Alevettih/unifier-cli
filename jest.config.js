// jest.config.js
const { pathsToModuleNameMapper } = require('ts-jest');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig');

module.exports = {
  roots: ['<rootDir>/src'],
  verbose: true,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testPathIgnorePatterns: ['/codebase/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  silent: true,
  preset: 'ts-jest',
  testMatch: null
};
