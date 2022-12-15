import { command } from 'execa';
import { OutputFormatter } from '@helpers/output-formatter.helper';

// TODO - fix webpack (it's parsing this file as .js)
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
export function getCodebaseRepositoryTask({ codebaseInfo, directories: { base } }, task) {
  const branchPart = codebaseInfo?.branchName ? ` -b ${codebaseInfo?.branchName}` : '';
  task.output = OutputFormatter.info('Fetching actual codebase...');
  return command(
    `git clone${branchPart} https://github.com/requestum-team/unifier-codebase-angular.git ${base.codebase}`
  );
}
