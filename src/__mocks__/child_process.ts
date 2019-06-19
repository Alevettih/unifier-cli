// tslint:disable-next-line:variable-name
const child_process: ChildProcess = jest.genMockFromModule('child_process');
import { EventEmitter } from 'events';

const emitter = new EventEmitter();
emitter.setMaxListeners(100);
emitter.on('newListener', (event, listener) => {
  if (event === 'exit') {
    listener();
  }
});

interface ChildProcess {
  spawn: () => EventEmitter;
}

child_process.spawn = jest.fn().mockReturnValue(emitter);

module.exports = child_process;
