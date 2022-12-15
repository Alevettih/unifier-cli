import { Listr } from 'listr2';
import { IAppContext } from '@interface/app-context.interface';
import { initArguments } from '@helpers/init-arguments.helper';
import { isDirectoryExistsAndNotEmpty } from '@helpers/verifications/is-directory-exists-and-no-empty.helper';
import { errorHandler } from '@helpers/error-handler.helper';
import { askQuestionsTask } from '@tasks/main/ask-questions.task';
import { eraseProjectDirTask } from '@tasks/main/erase-project-dir.task';
import { configureProjectTask } from '@tasks/main/configure-project.task';
import { checkDependenciesDataTask } from '@tasks/main/check-dependencies-data.task';

export const args: IAppContext = initArguments(process.argv);

export default async function main(): Promise<void | IAppContext> {
  const task = new Listr(
    [
      {
        title: 'Checking dependencies data',
        task: checkDependenciesDataTask
      },
      {
        title: 'Answer some questions',
        skip: () => process.env.NODE_ENV === 'test',
        task: askQuestionsTask
      },
      {
        title: 'Erase existing project directory',
        enabled: ({ title }: IAppContext): boolean => isDirectoryExistsAndNotEmpty(title),
        task: eraseProjectDirTask
      },
      {
        title: 'Configure Project',
        task: configureProjectTask
      }
    ],
    {
      ctx: args,
      rendererOptions: {
        formatOutput: 'wrap',
        showErrorMessage: false,
        collapseErrors: false,
        collapse: false
      }
    }
  );

  return task.run().catch(errorHandler);
}
