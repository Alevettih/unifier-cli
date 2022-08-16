import { getAngularJsonChanges } from '@specifier/configs/angular.config/angular-json.config';
import { devDependencies, dependencies } from '@specifier/configs/angular.config/dependencies.config';
import { getPackageJsonChanges, fieldsToDelete } from '@specifier/configs/angular.config/package-json.config';
import { getConfigsPaths } from '@specifier/configs/angular.config/paths.config';

export default {
  getAngularJsonChanges,
  devDependencies,
  dependencies,
  packageJson: {
    getChanges: getPackageJsonChanges,
    fieldsToDelete
  },
  getConfigsPaths
};
