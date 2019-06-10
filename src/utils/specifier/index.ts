import { copy, readJsonSync, writeJson } from 'fs-extra';
import { join } from 'path';
import { ChildProcess, spawn } from 'child_process';
import { PackageJson } from 'tsconfig-paths/lib/filesystem';
import { green, red } from 'colors/safe';
import { childProcessPromise } from '@utils/helpers';

export interface LinterConfig {
  modules: string[];
  script: string;
  path: string;
}

export class Specifier {
  readonly project: string;
  readonly childProcessOptions: object;

  stylelint: LinterConfig = {
    modules: [
      'stylelint',
      'stylelint-config-standard',
      'stylelint-declaration-strict-value',
      'stylelint-no-unsupported-browser-features',
      'stylelint-scss',
      'stylelint-z-index-value-constraint'
    ],
    script: 'stylelint --syntax scss "./src/**/*.scss"',
    path: '../../specification/files/.stylelintrc'
  };

  eslint: LinterConfig = {
    modules: [
      'eslint',
      'eslint-config-airbnb',
      'eslint-plugin-compat',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y'
    ],
    script: 'eslint "./src/**/*.js"',
    path: '../../specification/files/.eslintrc'
  };

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

  copyEditorconfig(): Promise<void> {
    return copy(
      join(__dirname, '../../specification/files/.editorconfig'),
      join(this.name, '.editorconfig')
    ).then(
      () => { console.log(green('Editorconfig successfully copied!')); },
      (err) => { throw new Error(red(`Editorconfig copying failed: ${err}`)); }
    );
  }

  copyBrowserslistrc(): Promise<void> {
    return copy(
      join(__dirname, '../../specification/files/.browserslistrc'),
      join(this.name, '.browserslistrc')
    ).then(
      () => { console.log(green('Browserslist successfully copied!')); },
      (err) => { throw new Error(red(`browserslistrc copying failed: ${err}`)); }
    );
  }

  addStylelintTaskToPackageJson(): Promise<void> {
    const packageJson: PackageJson = readJsonSync( join(this.name, 'package.json') );
    packageJson.scripts['lint:scss'] = this.stylelint.script;
    return writeJson(
      join(this.name, 'package.json'),
      packageJson,
      { spaces: 2 }
    ).then(
      () => { console.log(green('stylelint task successfully added!')); },
      (err) => { throw new Error(red(`adding of stylelint task failed: ${err}`)); }
    );
  }

  copyStylelintrc(): Promise<void> {
    return copy(
      join(__dirname, this.stylelint.path),
      join(this.name, '.stylelintrc')
    ).then(
      () => { console.log(green('Stylelint successfully initiated!')); },
      (err) => { throw new Error(red(`Stylelint init was fell: ${err}`)); }
    );
  }

  addEslintTaskToPackageJson(): Promise<void> {
    const packageJson: PackageJson = readJsonSync( join(this.name, 'package.json') );
    packageJson.scripts['lint:es'] = this.eslint.script;
    return writeJson(
      join(this.name, 'package.json'),
      packageJson,
      { spaces: 2 }
    ).then(
      () => { console.log(green('eslint task successfully added!')); },
      (err) => { throw new Error(red(`adding of eslint task failed: ${err}`)); }
    );
  }

  copyEslintrc(): Promise<void> {
    return copy(
      join(__dirname, this.eslint.path),
      join(this.name, '.eslintrc')
    ).then(
      () => { console.log(green('.eslintrc successfully copied!')); },
      (err) => { throw new Error(red(`.eslintrc copying was fell: ${err}`)); }
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

  initialCommit() {
    return childProcessPromise(
      spawn(
        'git add .; git commit -m "Initial commit" -n',
        Object.assign({shell: true}, this.childProcessOptions)
      )
    ).then(
      () => { console.log(green('initial commit was successfully done!')); },
      (err) => { throw new Error(red(`Initial commit error: ${err}`)); }
    );
  }

  addLintHooks() {
    const packageJson: PackageJson & { husky: {} } = readJsonSync( join(this.name, 'package.json') );
    const lintScripts: string[] = Object.keys(packageJson.scripts)
      .filter((key: string): boolean => key.includes('lint'))
      .map((script: string): string => `npm run ${script}`);

    packageJson.scripts['lint:all'] = lintScripts.join(' && ');
    packageJson.husky = {
      hooks: {
        'pre-commit': 'npm run lint:all'
      }
    };

    return writeJson(
      join(this.name, 'package.json'),
      packageJson,
      { spaces: 2 }
    );
  }
}
