import split from 'split';
import { Readable, Writable } from 'stream';
import { filter, from, map, merge, Observable, startWith } from 'rxjs';
import { command, Options, ExecaChildProcess, ExecaReturnValue } from 'execa';
import { OutputFormatter } from '@helpers/output-formatter.helper';
import { observableFromStream } from '@helpers/observable-from-stream.helper';

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
