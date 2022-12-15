import { OutputFormatter } from '@helpers/output-formatter.helper';
import { ExecaError } from 'execa';

export function errorHandler(error: ExecaError & { exitCodeName: string }): void {
  if (error?.message?.includes?.('Cancelled prompt.')) {
    return;
  }

  if (error) {
    console.log();
    console.log('Project creation failed: ');
    if (typeof error.exitCode === 'number') {
      console.log(
        'Error: ',
        OutputFormatter.danger(
          `Command failed with exit code ${error.exitCode} ${error.exitCodeName ? `(${error.exitCodeName})` : ''}`
        )
      );
    }

    if (error.command) {
      console.log('Command: ', OutputFormatter.code(error.command));
    }

    if (error.stderr) {
      console.log('Error log: ');
      console.log(OutputFormatter.danger(error.stderr));
    }

    if (!error.command || !error.exitCode || !error.stderr) {
      console.log('Plain error: ');
      console.dir(error);
    }
    throw new Error(`Project creation failed: ${error}`);
  }
}
