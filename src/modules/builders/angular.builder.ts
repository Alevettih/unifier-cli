import { Listr } from 'listr2';
import { IAppContext } from '@interface/app-context.interface';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { installPackagesTask } from '@tasks/builders/install-packages.task';
import { initialCommitTask } from '@tasks/builders/initial-commit.task';
import { copyConfigsTask } from '@tasks/builders/copy-configs.task';
import { runPrettierTask } from '@tasks/builders/run-prettier.task';
import { updateGitignoreRulesTask } from '@tasks/builders/update-gitignore-rules.task';
import { copyBaseStructureTask } from '@tasks/builders/angular/copy-base-structure.task';
import { updateDependenciesTask } from '@tasks/builders/angular/update-dependencies.task';
import { updatePackageJsonScriptsTask } from '@tasks/builders/angular/update-package-json-scripts.task';
import { ngAddTask } from '@tasks/builders/angular/ng-add.task';
import { generateProjectsTask } from '@tasks/builders/angular/generate-projects.task';
import { addTokensToAssetsTask } from '@tasks/builders/angular/add-tokens-to-assets.task';
import { editAngularJsonTask } from '@tasks/builders/angular/edit-angular-json.task';
import { initWorkspaceTask } from '@tasks/builders/angular/init-workspace.task';
import { removeTmpTask } from '@tasks/builders/remove-tmp.task';
import { getLintersTask } from '@tasks/builders/get-linters.task';
import { runLintersTask } from '@tasks/builders/run-linters.task';
import { createTmpTask } from '@tasks/builders/create-tmp.task';
import { ProjectType } from '@enum/project-type.enum';
import { getCodebaseRepositoryTask } from '@tasks/builders/get-codebase-repository.task';
import { getMiscRepositoryTask } from '@tasks/builders/get-misc-repository.task';

export function angularBuilder(): Listr {
  return new Listr([
    {
      title: 'Init Angular workspace',
      task: initWorkspaceTask
    },
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
            title: `Update ${OutputFormatter.accent('package.json')}`,
            task: (): Listr =>
              new Listr([
                {
                  title: `Update scripts`,
                  task: updatePackageJsonScriptsTask
                },
                {
                  title: `Add dependencies`,
                  task: updateDependenciesTask
                },
                {
                  task: installPackagesTask
                }
              ])
          },
          {
            title: 'Add Angular libraries',
            task: (): Listr =>
              new Listr([
                {
                  title: 'Add Material',
                  task: ngAddTask(`@angular/material`)
                },
                {
                  title: 'Add ESLint',
                  task: ngAddTask(`@angular-eslint/schematics`)
                }
              ])
          },
          {
            title: 'Generate application(s)',
            task: generateProjectsTask
          },
          {
            title: 'Copy the base structure of project',
            task: copyBaseStructureTask
          },
          {
            title: `Add token(s) to assets directory (should be in ${OutputFormatter.accent('.gitignore')})`,
            task: addTokensToAssetsTask
          },
          {
            title: `Edit ${OutputFormatter.accent('angular.json')}`,
            task: editAngularJsonTask
          },
          {
            title: `Update ${OutputFormatter.accent('.gitignore')} rules`,
            task: updateGitignoreRulesTask
          },
          {
            title: 'Copy configs',
            task: copyConfigsTask
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
      task: initialCommitTask(true)
    },
    {
      title: 'Clean tool',
      task: removeTmpTask
    }
  ]);
}
