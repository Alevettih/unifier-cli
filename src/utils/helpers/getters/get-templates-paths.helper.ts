import { ApplicationType } from '@src/main';
import { IPaths } from '@utils/specifier';
import { join } from 'path';
import { AngularSpecifier } from '@specifier/angular.specifier';

export function getAppTemplatesPaths(title: string, app: ApplicationType): IPaths[] {
  return [
    getSrcTemplatePath('tsconfig.app.json'),
    getSrcTemplatePath('tsconfig.spec.json'),
    getSrcTemplatePath('src/index.html'),
    getSrcTemplatePath('src/main.ts'),
    getSrcTemplatePath('src/app/app.component.html'),
    getSrcTemplatePath('src/app/app.component.scss'),
    getSrcTemplatePath('src/app/app.component.ts'),
    getSrcTemplatePath('src/app/app.module.ts'),
    getSrcTemplatePath('src/app/app-routing.module.ts'),
    {
      src: join(__dirname, AngularSpecifier.TEMPLATES_DIR, 'angular', 'project.module.ts.mustache'),
      dist: join(title, `/src/app/modules/main/${app}/${app}.module.ts`)
    }
  ];

  function getSrcTemplatePath(fileName: string) {
    return {
      src: join(__dirname, AngularSpecifier.TEMPLATES_DIR, 'angular', 'project', `${fileName}.mustache`),
      dist: join(title, 'projects', app, fileName)
    };
  }
}

export function getReadmeTemplatePath(title: string): IPaths {
  return {
    src: join(__dirname, AngularSpecifier.TEMPLATES_DIR, 'angular', 'README.md.mustache'),
    dist: join(title, 'README.md')
  };
}
