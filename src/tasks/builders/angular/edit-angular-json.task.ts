import { join } from 'path';
import * as deepMerge from 'deepmerge';
import { ListrTaskWrapper } from 'listr2';
import { readJsonSync, writeJsonSync } from 'fs-extra';
import { IAppInfo } from '@interface/app-info.interface';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { major } from 'semver';

export function editAngularJsonTask(
  { title, applicationsInfo, version }: IAppContext,
  task: ListrTaskWrapper<IAppContext, any>
): void {
  task.output = OutputFormatter.info(`Getting ${OutputFormatter.accent('angular.json')} file...`);
  const pathToJson: string = join(title, 'angular.json');
  let angularJson: any = readJsonSync(pathToJson);

  task.output = OutputFormatter.info(`Updating ${OutputFormatter.accent('angular.json')} file...`);
  const shouldNotUsePolyfillsJs: boolean = major(version) >= 15;
  angularJson = deepMerge(angularJson, getAngularJsonChanges(applicationsInfo, shouldNotUsePolyfillsJs), {
    arrayMerge: (target: any[], source: any[]): any[] => source
  });

  delete angularJson?.projects?.[title];

  task.output = OutputFormatter.info(`Updating ${OutputFormatter.accent('angular.json')} file...`);
  return writeJsonSync(pathToJson, angularJson, { spaces: 2 });
}

function getAngularJsonChanges(applicationsInfo: IAppInfo[], shouldNotUsePolyfillsJs: boolean): any {
  const json: any = {
    projects: {
      default: {
        projectType: 'application',
        root: '',
        sourceRoot: 'src',
        prefix: '',
        schematics: {
          '@schematics/angular:component': { style: 'scss' },
          '@schematics/angular:application': { strict: true }
        },
        architect: {
          build: {
            builder: '@angular-devkit/build-angular:browser',
            options: { stylePreprocessorOptions: { includePaths: ['src/scss'] } }
          },
          lint: {
            builder: '@angular-eslint/builder:lint',
            options: { lintFilePatterns: ['src/**/*.ts', 'src/**/*.html'] }
          }
        }
      }
    },
    cli: {
      analytics: false
    }
  };

  applicationsInfo.forEach(({ name }: IAppInfo): void => {
    const options = {
      polyfills: shouldNotUsePolyfillsJs ? ['zone.js'] : 'src/polyfills.ts',
      assets: ['src/.htaccess', 'src/default.conf', 'src/favicon.ico', 'src/assets'],
      styles: ['src/styles.scss', 'node_modules/ngx-toastr/toastr.css'],
      scripts: [],
      stylePreprocessorOptions: { includePaths: ['src/scss'] }
    };

    json.projects[name] = {
      schematics: { '@schematics/angular:application': { strict: true } },
      sourceRoot: 'src',
      prefix: 'client',
      architect: {
        build: {
          options: { ...options, allowedCommonJsDependencies: ['class-transformer', 'lodash'] },
          configurations: {
            production: {
              fileReplacements: [
                {
                  replace: 'src/environments/environment.ts',
                  with: 'src/environments/environment.prod.ts'
                }
              ]
            }
          }
        },
        test: { options, polyfills: shouldNotUsePolyfillsJs ? ['zone.js', 'zone.js/testing'] : options.polyfills }
      }
    };
  });

  return json;
}
