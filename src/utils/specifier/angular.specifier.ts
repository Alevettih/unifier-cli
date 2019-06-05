import { copy, readJsonSync, removeSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { deepMerge } from '@utils/helpers';
import * as angularJsonAdditions from '@specification/files/angular/angular.json';
import { Specifier } from '@utils/specifier';
import { green, red } from 'colors/safe';

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

  copyBrowserslistrc(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        removeSync(join(this.name, 'src/browserslist'));

        resolve();
      } catch (err) {
        reject(red(`.browserslistrc copying failed: ${err}`));
      }
    }).then(() => super.copyBrowserslistrc());
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
        reject(red(`Base structure copying failed: ${err}`));
      }
    }).then(() => console.log(green('Base structure successfully copied!')));
  }

  editAngularJson(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const json = readJsonSync(`${this.name}/angular.json`);

        if (!json) {
          reject(new Error(red('The file does not exist!')));
        }

        await writeJson(
          `${this.name}/angular.json`,
          deepMerge({}, json, {projects: {[this.name]: angularJsonAdditions}}),
          { spaces: 2 }
        );

        resolve();
      } catch (err) {
        reject(red(`angular.json editing failed: ${err}`));
      }
    }).then(() => console.log(green('Angular.json successfully edited!')));
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
        reject(red(`Tsconfig copying failed: ${err}`));
      }
    }).then(() => console.log(green('Tsconfig successfully copied!')));
  }

  copyHtaccess(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await copy(
          join(__dirname, '../../specification/files/angular/.htaccess'),
          join(this.name, 'src/.htaccess')
        );

        resolve();
      } catch (err) {
        reject(new Error(red(`Htaccess copying failed: ${err}`)));
      }
    }).then(() => console.log(green('Htaccess successfully copied!')));
  }
}
