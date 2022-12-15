import { Listr } from 'listr2';
import { ProjectType } from '@enum/project-type.enum';
import { IAppContext } from '@interface/app-context.interface';
import { angularBuilder } from '@modules/builders/angular.builder';
import { webpackBuilder } from '@modules/builders/webpack.builder';
import { OutputFormatter } from '@helpers/output-formatter.helper';

export function configureProjectTask(ctx: IAppContext): Listr {
  if (!ctx.title) {
    throw new Error(OutputFormatter.danger('Target directory is required!'));
  }

  switch (ctx?.type) {
    case ProjectType.ANGULAR:
      return angularBuilder();
    case ProjectType.MARKUP:
    case ProjectType.EMAIL:
      return webpackBuilder();
  }
}
