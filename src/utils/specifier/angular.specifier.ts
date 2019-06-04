import { copy, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { deepMerge } from '@utils/helpers';
import * as angularJsonAdditions from '@specification/files/angular/angular.json';
import { Specifier } from '@utils/specifier';

export class AngularSpecifier extends Specifier {
  async specify(): Promise<void> {
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

  copyBaseStructure(): Promise<void> {
    return new Promise( async (resolve, reject) => {
      try {
        await copy(
          join(__dirname, '../../codebase/angular'),
          join(this.name, 'src')
        );

        resolve();
      } catch (err) {
        reject(`Base structure copying failed: ${err}`);
      }
    }).then(() => console.log('Base structure successfully copied!'));
  }

  editAngularJson(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const json = readJsonSync(`${this.name}/angular.json`);

        if (!json) {
          reject(new Error('The file does not exist!'));
        }

        await writeJson(
          `${this.name}/angular.json`,
          deepMerge({}, json, {projects: {[this.name]: angularJsonAdditions}}),
          { spaces: 2 }
        );

        resolve();
      } catch (err) {
        reject(`angular.json editing failed: ${err}`);
      }
    }).then(() => console.log('Angular.json successfully edited!'));
  }

  copyTsconfig(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await copy(
          join(__dirname, '../../specification/files/angular/tsconfig.json'),
          join(this.name, 'tsconfig.json')
        );

        resolve();
      } catch (err) {
        reject(`Tsconfig copying failed: ${err}`);
      }
    }).then(() => console.log('Tsconfig successfully copied!'));
  }

  async copyHtaccess(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await copy(
          join(__dirname, '../../specification/files/angular/.htaccess'),
          join(this.name, 'src/.htaccess')
        );

        resolve();
      } catch (err) {
        reject(new Error(`Htaccess copying failed: ${err}`));
      }
    }).then(() => console.log('Htaccess successfully copied!'));
  }
}
