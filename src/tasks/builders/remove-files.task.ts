import { existsSync, removeSync } from 'fs-extra';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { getFilenameFromPath } from '@helpers/getters/get-filename-from-path.helper';

// TODO - fix webpack (it's parsing this file as .js)
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
export function removeFilesTask(files, task) {
  files.forEach(path => {
    if (existsSync(path)) {
      task.output = OutputFormatter.info(`Remove ${OutputFormatter.accent(getFilenameFromPath(path))}`);
      removeSync(path);
    }
  });
}
