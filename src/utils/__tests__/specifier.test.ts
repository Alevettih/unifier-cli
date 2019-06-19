import { Specifier } from '../specifier';
import * as fs from 'fs-extra';
import * as child_process from 'child_process';
import { join } from 'path';

jest.mock('fs-extra');
jest.mock('child_process');

describe('Specifier should', () => {
  const testDir = 'target-tmp';
  let specifier: Specifier;

  beforeEach(() => {
    specifier = new Specifier(testDir);
  });

  test('init an instance', (): void => {
    expect(() => new Specifier('')).toThrow();
    expect(() => new Specifier(testDir)).not.toThrow();
    expect(specifier).toBeInstanceOf(Specifier);
    expect(specifier.project).toBe(testDir);
    expect(specifier.childProcessOptions).toBeInstanceOf(Object);
  });

  test('execute "npm i" with passed modules', async (): Promise<void> => {
    specifier.npmInstall();
    expect(child_process.spawn).toBeCalledWith('npm', ['i'], specifier.childProcessOptions);

    specifier.npmInstall(['test']);
    expect(child_process.spawn).toBeCalledWith('npm', ['i', 'test'], specifier.childProcessOptions);
  });

  test('copy configs', async (): Promise<void> => {
    await specifier.copyConfigs({src: '', dist: ''}, {src: '', dist: ''});
    expect(fs.copy).toBeCalledTimes(2);
  });

  test('remove default Git', async (): Promise<void> => {
    await specifier.removeDefaultGit();

    expect(child_process.spawn).toBeCalledWith('rm', ['-rf', '.git'], specifier.childProcessOptions);
  });

  test('init Git repo', async (): Promise<void> => {
    await specifier.initGit();

    expect(child_process.spawn).toBeCalledWith(
      'git init',
      Object.assign({shell: true}, specifier.childProcessOptions)
    );
  });

  test('add config.js', async (): Promise<void> => {
    await specifier.addConfigJs();

    expect(fs.outputFile).toBeCalled();
  });

  test('add link to config js in html', async (): Promise<void> => {
    Object.defineProperty(fs, 'readFileSync', {value: jest.fn(() => '<title>Test</title>')});

    await specifier.addLinkToConfigJsInHtml();

    expect(fs.readFileSync).toBeCalled();
    expect(fs.outputFile).toBeCalledWith(
      join(specifier.name, 'public/index.html'),
      '<title>Test</title>\n    <script src="./config.js"></script>',
      'utf-8'
    );
  });

  test('Do initial commit', async (): Promise<void> => {
    await specifier.initialCommit();

    expect(child_process.spawn).toBeCalledWith(
      'git add .; git commit -m "Initial commit" -n',
      Object.assign({shell: true}, specifier.childProcessOptions)
    );
  });
});
