import * as path from 'path';

interface IFsExtra {
  __setMockFiles: (newMockFiles: any) => void;
  readdirSync: (directoryPath: string) => void;
  copy: (from: string, to: string) => Promise<void>;
  remove: (from: string) => Promise<void>;
  removeSync: (from: string) => void;
  writeJson: (to: string, json: string, opts: object) => Promise<void>;
  outputFile: (to: string, json: string, opts: object) => Promise<void>;
}

const fs: IFsExtra = jest.genMockFromModule('fs-extra');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles: object): void {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath: string): void {
  return mockFiles[directoryPath] || [];
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.copy = jest.fn(async () => null);
fs.remove = jest.fn(async () => null);
fs.removeSync = jest.fn(() => null);
fs.writeJson = jest.fn(async () => null);
fs.outputFile = jest.fn(async () => null);

module.exports = fs;
