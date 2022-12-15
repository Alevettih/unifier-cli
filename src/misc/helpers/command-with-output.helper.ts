import { filter, from, map, merge, Observable, startWith } from 'rxjs';
import { ExecaChildProcess, ExecaReturnValue } from 'execa';
import { observableFromStream } from '@helpers/observable-from-stream.helper';
import split from 'split';
import { command, Options } from 'execa';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { Readable, Writable } from 'stream';

export function commandWithOutput(cm: string, options?: Options): Observable<string> {
  const childProcess: ExecaChildProcess = command(cm, options);

  return merge(
    from(childProcess),
    ...childProcess.stdio.map(
      (stream: Writable | Readable): Observable<string> =>
        observableFromStream(stream.pipe(split(null, null, { trailing: false })))
    )
  ).pipe(
    startWith(OutputFormatter.code(cm)),
    filter((data: ExecaReturnValue | string): boolean => typeof data === 'string'),
    map((data: string): string => OutputFormatter.info(data))
  );
}
