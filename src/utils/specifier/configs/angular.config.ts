import { getAngularJsonChanges } from '@specifier/configs/angular/angular-json.config';
import { devDependencies, dependencies } from '@specifier/configs/angular/dependencies.config';
import { getPackageJsonChanges } from '@specifier/configs/angular/package-json.config';
import { getConfigsPaths } from '@specifier/configs/angular/paths.config';

export default {
  getAngularJsonChanges,
  devDependencies,
  dependencies,
  getPackageJsonChanges,
  getConfigsPaths
};
