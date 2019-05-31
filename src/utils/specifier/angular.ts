import { copySync, readJsonSync, writeJsonSync } from 'fs-extra';
import { join } from 'path';
import { deepMerge } from '@utils/helpers';
import * as angularJsonAdditions from '@specification/files/angular/angular.json';
import { Specifier } from "@utils/specifier";

export class AngularSpecifier extends Specifier {
  async specify (): Promise<void> {
    this.editAngularJson();
    this.copyHtaccess();
    this.copyBrowserslistrc();
    this.copyTsconfig();
    this.copyBaseStructure();
    this.copyEditorconfig();
    await this.copyStylelintrc();
    await this.initialCommit();
  }

  copyBaseStructure(): void {
    copySync(
      join(__dirname, '../../codebase/angular'),
      join(this.name, 'src')
    )
  }

  editAngularJson(): void {
    const json = readJsonSync(`${this.name}/angular.json`);

    if (!json) {
      throw new Error('The file does not exist!');
    }

    writeJsonSync(
      `${this.name}/angular.json`,
      deepMerge({}, json, {projects: {[this.name]: angularJsonAdditions}}),
      { spaces: 2 }
    );
  }

  copyTsconfig(): void {
    copySync(
      join(__dirname, '../../specification/files/angular/tsconfig.json'),
      join(this.name, 'tsconfig.json')
    );
  }

  copyHtaccess(): void {
    copySync(
      join(__dirname, '../../specification/files/angular/.htaccess'),
      join(this.name, 'src/.htaccess')
    );
  }
}
