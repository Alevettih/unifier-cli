import { Listr } from 'listr2';
import { IAppContext } from '@interface/app-context.interface';
import { installPackagesTask } from '@tasks/builders/install-packages.task';
import { initializeGitTask } from '@tasks/builders/initialize-git.task';
import { initialCommitTask } from '@tasks/builders/initial-commit.task';
import { copyConfigsTask } from '@tasks/builders/copy-configs.task';
import { runPrettierTask } from '@tasks/builders/run-prettier.task';
import { copyBaseStructureTask } from '@tasks/builders/webpack/copy-base-structure.task';
import { removeTmpTask } from '@tasks/builders/remove-tmp.task';
import { getLintersTask } from '@tasks/builders/get-linters.task';
import { runLintersTask } from '@tasks/builders/run-linters.task';
import { createTmpTask } from '@tasks/builders/create-tmp.task';
import { ProjectType } from '@enum/project-type.enum';
import { getCodebaseRepositoryTask } from '@tasks/builders/get-codebase-repository.task';
import { getMiscRepositoryTask } from '@tasks/builders/get-misc-repository.task';

export function webpackBuilder(): Listr {
  return new Listr([
    {
      title: `Prepare tool`,
      task: (): Listr =>
        new Listr([
          { task: removeTmpTask },
          { task: createTmpTask },
          {
            title: 'Get codebase',
            enabled: ({ type }: IAppContext): boolean => type === ProjectType.ANGULAR,
            task: getCodebaseRepositoryTask
          },
          {
            title: 'Get configs & file templates',
            task: getMiscRepositoryTask
          }
        ])
    },
    {
      title: 'Setup codebase',
      task: (): Listr =>
        new Listr([
          {
            title: 'Copy the base structure of project',
            task: copyBaseStructureTask
          },
          {
            title: 'Copy configs',
            task: copyConfigsTask
          },
          {
            title: `Init Git`,
            task: initializeGitTask
          },
          {
            task: installPackagesTask
          }
        ])
    },
    {
      title: 'Run Prettier',
      task: runPrettierTask
    },
    {
      title: 'Run linters',
      task: (): Listr =>
        new Listr(
          [
            {
              title: 'Get Available linters',
              task: getLintersTask
            },
            {
              title: 'Fix linting errors, if possible',
              skip: ({ lintersKeys }: IAppContext): boolean => !lintersKeys.length,
              task: runLintersTask
            }
          ],
          { exitOnError: false }
        )
    },
    {
      title: 'Do initial commit',
      enabled: ({ skipGit }: IAppContext): boolean => !skipGit,
      task: initialCommitTask(false)
    },
    {
      title: 'Clean tool',
      task: removeTmpTask
    }
  ]);
}
