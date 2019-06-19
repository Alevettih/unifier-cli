import { copy, outputFile, readFileSync, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { spawn } from 'child_process';
import { green, red } from 'colors/safe';
import { childProcessPromise, newlineSeparatedValue, arrayMerge } from '@utils/helpers';
import * as deepMerge from 'deepmerge';

export interface ConfigPaths {
  src: string;
  dist: string;
}

export class Specifier {
  readonly project: string;
  readonly childProcessOptions: object;

  constructor(project: string) {
    if (!project) {
      throw new Error('Target directory is required!');
    }

    this.project = project;
    this.childProcessOptions = { cwd: join(project), stdio: 'inherit' };
  }

  get name(): string {
    return this.project;
  }

  copyConfigs(...paths: ConfigPaths[]): Promise<void> {
    return Promise.all(
      paths.map(
        (path: ConfigPaths): Promise<void> => copy(path.src, path.dist)
      )
    ).then(
      () => { console.log(green('Configs successfully copied!')); },
      (err) => { throw new Error(red(`Config copying failed: ${err}`)); }
    );
  }

  mergeWithJson(pathToJson: string, objToMerge: object): Promise<void> {
    const json = readJsonSync( pathToJson );
    return writeJson(
      pathToJson,
      deepMerge(json, objToMerge),
      { spaces: 2 }
    ).then(
      () => { console.log(green('JSON successfully updated!')); },
      (err) => { throw new Error(red(`JSON update failed: ${err}`)); }
    );
  }

  updateGitignoreRules(): Promise<void> {
    const projectGitignore: object = newlineSeparatedValue.parse(
      readFileSync(
        join(this.name, '.gitignore'), 'utf-8'
      )
    );
    const specificationGitignore: object = newlineSeparatedValue.parse(
      readFileSync(
        join(__dirname, '../../specification/files/.gitignore'), 'utf-8'
      )
    );

    return outputFile(
      join(this.name, '.gitignore'),
      newlineSeparatedValue.stringify(
        deepMerge( projectGitignore, specificationGitignore, { arrayMerge } )
      ),
      'utf-8'
    ).then(
      () => { console.log(green('.gitignore successfully updated!')); },
      (err) => { throw new Error(red(`.gitignore update failed: ${err}`)); }
    );
  }

  npmInstall(modules = [] as string[]) {
    return childProcessPromise(
      spawn(
        'npm',
        ['i', ...modules],
        this.childProcessOptions
      )
    ).then(
      () => { console.log(green('Modules successfully installed!')); },
      (err) => { throw new Error(red(`Modules installation failed: ${err}`)); }
    );
  }

  removeDefaultGit(): Promise<void> {
    return childProcessPromise(
      spawn('rm', ['-rf', '.git'], this.childProcessOptions)
    ).then(
      () => { console.log(green('Default Git removed')); },
      (err) => { throw new Error(red(`Default Git removing error: ${err}`)); }
    );
  }

  initGit() {
    return childProcessPromise(
      spawn(
        'git init',
        Object.assign({shell: true}, this.childProcessOptions)
      )
    ).then(
      () => { console.log(green('Git repository successfully initiated!')); },
      (err) => { throw new Error(red(`Git init error: ${err}`)); }
    );
  }

  initialCommit(props?: string) {
    return childProcessPromise(
      spawn(
        `git add .; git commit -m "Initial commit" -n${props ? ` ${props}` : ''}`,
        Object.assign({shell: true}, this.childProcessOptions)
      )
    ).then(
      () => { console.log(green('initial commit was successfully done!')); },
      (err) => { throw new Error(red(`Initial commit error: ${err}`)); }
    );
  }

  addConfigJs(): Promise<void> {
    return outputFile(
      join(this.name, 'public/config.js'),
      '// eslint-disable-next-line no-underscore-dangle\n(window || global).__ENV__ = Object.freeze({\n\n});',
      'utf-8'
    ).then(
      () => { console.log(green('config.js successfully created!')); },
      (err) => { throw new Error(red(`config.js creation failed: ${err}`)); }
    );
  }

  addLinkToConfigJsInHtml(): Promise<void>  {
    const html: string = readFileSync(
      join(this.name, 'public/index.html'), 'utf-8'
    );

    return outputFile(
      join(this.name, 'public/index.html'),
      html.replace('</title>', '</title>\n    <script src="./config.js"></script>'),
      'utf-8'
    ).then(
      () => { console.log(green('index.html successfully updated!')); },
      (err) => { throw new Error(red(`index.html update failed: ${err}`)); }
    );
  }
}
