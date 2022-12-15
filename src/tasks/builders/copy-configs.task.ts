import { join } from 'path';
import { copySync } from 'fs-extra';
import { ListrTaskWrapper } from 'listr2';
import { ProjectType } from '@enum/project-type.enum';
import { IPaths } from '@interface/paths.interface';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { getFilenameFromPath } from '@helpers/getters/get-filename-from-path.helper';

export function copyConfigsTask(ctx: IAppContext, task: ListrTaskWrapper<IAppContext, any>): void {
  for (const { src, dist } of getConfigsPaths(ctx)) {
    task.output = OutputFormatter.info(`Copy ${OutputFormatter.accent(getFilenameFromPath(src))} file`);

    copySync(src, dist);
  }
}

function getConfigsPaths({ type, title, directories: { angular, base } }: IAppContext): IPaths[] {
  switch (type) {
    case ProjectType.ANGULAR:
      return [
        {
          src: join(base.configs, '.prettierrc'),
          dist: join(title, '.prettierrc')
        },
        {
          src: join(base.configs, '.prettierignore'),
          dist: join(title, '.prettierignore')
        },
        {
          src: join(angular.configs, '.htaccess'),
          dist: join(title, 'src/.htaccess')
        },
        {
          src: join(angular.configs, 'default.conf'),
          dist: join(title, 'src/default.conf')
        },
        {
          src: join(angular.configs, '.eslintrc.json'),
          dist: join(title, '.eslintrc.json')
        },
        {
          src: join(angular.configs, 'tsconfig.json'),
          dist: join(title, 'tsconfig.json')
        },
        {
          src: join(base.configs, '.browserslistrc'),
          dist: join(title, '.browserslistrc')
        },
        {
          src: join(base.configs, '.editorconfig'),
          dist: join(title, '.editorconfig')
        },
        {
          src: join(angular.configs, '.stylelintrc'),
          dist: join(title, '.stylelintrc')
        }
      ];
    case ProjectType.MARKUP:
      return [
        {
          src: join(base.configs, '.prettierrc'),
          dist: join(title, '.prettierrc')
        },
        {
          src: join(base.configs, '.prettierignore'),
          dist: join(title, '.prettierignore')
        },
        {
          src: join(base.configs, '.editorconfig'),
          dist: join(title, '.editorconfig')
        },
        {
          src: join(base.configs, '.browserslistrc'),
          dist: join(title, '.browserslistrc')
        },
        {
          src: join(base.configs, '.gitignore'),
          dist: join(title, '.gitignore')
        },
        {
          src: join(base.configs, ProjectType.MARKUP, '.stylelintrc'),
          dist: join(title, '.stylelintrc')
        },
        {
          src: join(base.configs, ProjectType.MARKUP, '.eslintrc.json'),
          dist: join(title, '.eslintrc.json')
        },
        {
          src: join(base.configs, ProjectType.MARKUP, 'tsconfig.json'),
          dist: join(title, 'tsconfig.json')
        }
      ];
    case ProjectType.EMAIL:
      return [
        {
          src: join(base.configs, '.gitignore'),
          dist: join(title, '.gitignore')
        },
        {
          src: join(base.configs, '.editorconfig'),
          dist: join(title, '.editorconfig')
        },
        {
          src: join(base.configs, '.gitignore'),
          dist: join(title, '.editorconfig')
        },
        {
          src: join(base.configs, '.prettierignore'),
          dist: join(title, '.prettierignore')
        },
        {
          src: join(base.configs, '.prettierrc'),
          dist: join(title, '.prettierrc')
        },
        {
          src: join(base.configs, ProjectType.EMAIL, '.stylelintrc'),
          dist: join(title, '.stylelintrc')
        }
      ];
  }
}
