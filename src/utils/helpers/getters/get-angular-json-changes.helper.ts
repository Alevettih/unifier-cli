import { IApplicationInfo } from '@src/main';

export function getAngularJsonChanges(applicationsInfo: IApplicationInfo[]) {
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
    }
  };

  applicationsInfo.forEach(({ name }: IApplicationInfo): void => {
    const options = {
      polyfills: 'src/polyfills.ts',
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
        test: { options }
      }
    };
  });

  return json;
}
