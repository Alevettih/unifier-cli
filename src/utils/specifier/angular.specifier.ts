import { copy, outputFile, readJsonSync, remove, writeJson } from 'fs-extra';
import { join } from 'path';
import { deepMerge } from '@utils/helpers';
import * as angularJsonAdditions from '@specification/files/angular/angular.json';
import { Specifier } from '@utils/specifier';
import { green, red } from 'colors/safe';

export class AngularSpecifier extends Specifier {
  async specify(): Promise<void> {
    await this.initGit();
    await Promise.all([
      this.copyHtaccess(),
      this.copyBrowserslistrc(),
      this.copyTsconfig(),
      this.copyBaseStructure(),
      this.addConfigJsonToAssets(),
      this.copyEditorconfig(),
      this.copyStylelintrc()
    ]);
    await this.npmInstall(['husky', ...this.stylelint.modules]);
    await this.addStylelintTaskToPackageJson();
    await this.editAngularJson();
    await this.addLintHooks();
    await this.initialCommit();
  }

  copyBrowserslistrc(): Promise<void> {
    return remove(
      join(this.name, 'src/browserslist')
    ).then(
      () => super.copyBrowserslistrc(),
      (err) => {throw new Error(red(`.browserslistrc copying failed: ${err}`)); }
    );
  }

  copyBaseStructure(): Promise<void> {
    return copy(
      join(__dirname, '../../codebase/angular'),
      join(this.name, 'src')
    ).then(
      () => { console.log(green('Base structure successfully copied!')); },
      (err) => { throw new Error(red(`Base structure copying failed: ${err}`)); }
    );
  }

  editAngularJson(): Promise<void> {
    const json = readJsonSync(`${this.name}/angular.json`);

    if (!json) {
      throw new Error(red('The file does not exist!'));
    }

    return writeJson(
      join(this.project, 'angular.json'),
      deepMerge({}, json, {projects: {[this.name]: angularJsonAdditions}}),
      { spaces: 2 }
    ).then(
      () => { console.log(green('Angular.json successfully edited!')); },
      (err) => { throw new Error(red(`angular.json editing failed: ${err}`)); }
    );
  }

  copyTsconfig(): Promise<void> {
    return copy(
      join(__dirname, '../../specification/files/angular/tsconfig.json'),
      join(this.name, 'tsconfig.json')
    ).then(
      () => { console.log(green('Tsconfig successfully copied!')); },
      (err) => { throw new Error(red(`Tsconfig copying failed: ${err}`)); }
    );
  }

  copyHtaccess(): Promise<void> {
    return copy(
      join(__dirname, '../../specification/files/angular/.htaccess'),
      join(this.name, 'src/.htaccess')
    ).then(
      () => { console.log(green('Htaccess successfully copied!')); },
      (err) => { throw new Error(red(`Htaccess copying failed: ${err}`)); }
    );
  }

  addConfigJsonToAssets(): Promise<void> {
    return outputFile(
      join(this.name, 'src/assets/config.json'),
      '{}',
      'utf-8'
    ).then(
      () => { console.log(green('config.json successfully created!')); },
      (err) => { throw new Error(red(`config.json creation failed: ${err}`)); }
    );
  }
}
