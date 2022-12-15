import { Observable, Subscriber } from 'rxjs';
import { Readable } from 'stream';

type eventName = 'close' | 'data' | 'end' | 'error' | 'pause' | 'readable' | 'resume';

export function observableFromStream<T = string>(
  stream: Readable,
  finishEventName: eventName = 'end',
  dataEventName: eventName = 'data'
): Observable<T> {
  stream.pause();

  return new Observable((observer: Subscriber<T>) => {
    function dataHandler(data: T): void {
      observer.next(data);
    }

    function errorHandler(err: Error): void {
      observer.error(err);
    }

    function endHandler(): void {
      observer.complete();
    }

    stream.addListener(dataEventName, dataHandler);
    stream.addListener('error', errorHandler);
    stream.addListener(finishEventName, endHandler);

    stream.resume();

    return (): void => {
      stream.removeListener(dataEventName, dataHandler);
      stream.removeListener('error', errorHandler);
      stream.removeListener(finishEventName, endHandler);
    };
  });
}
