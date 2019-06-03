import { copy, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { deepMerge } from '@utils/helpers';
import * as angularJsonAdditions from '@specification/files/angular/angular.json';
import { Specifier } from "@utils/specifier";

export class AngularSpecifier extends Specifier {
  async specify (): Promise<void> {
    await Promise.all([
      this.editAngularJson(),
      this.copyHtaccess(),
      this.copyBrowserslistrc(),
      this.copyTsconfig(),
      this.copyBaseStructure(),
      this.copyEditorconfig(),
      this.copyStylelintrc()
    ]);
    await this.initialCommit();
  }

  async copyBaseStructure(): Promise<void> {
    await copy(
      join(__dirname, '../../codebase/angular'),
      join(this.name, 'src')
    ).then(() => {
      console.log('Base structure successfully copied!')
    }, (err) => {
      throw new Error(err);
    });
  }

  async editAngularJson(): Promise<void> {
    const json = readJsonSync(`${this.name}/angular.json`);

    if (!json) {
      throw new Error('The file does not exist!');
    }

    await writeJson(
      `${this.name}/angular.json`,
      deepMerge({}, json, {projects: {[this.name]: angularJsonAdditions}}),
      { spaces: 2 }
    ).then(() => {
      console.log('Angular.json successfully edited!')
    }, (err) => {
      throw new Error(err);
    });
  }

  async copyTsconfig(): Promise<void> {
    await copy(
      join(__dirname, '../../specification/files/angular/tsconfig.json'),
      join(this.name, 'tsconfig.json')
    ).then(() => {
      console.log('Tsconfig successfully copied!')
    }, (err) => {
      throw new Error(err);
    });
  }

  async copyHtaccess(): Promise<void> {
    await copy(
      join(__dirname, '../../specification/files/angular/.htaccess'),
      join(this.name, 'src/.htaccess')
    ).then(() => {
      console.log('Htaccess successfully copied!')
    }, (err) => {
      throw new Error(err);
    });
  }
}
