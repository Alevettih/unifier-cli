import { Specifier } from '@specifier/index';
import { ChildProcess, spawn } from 'child_process';

export class PlainJSSpecifier extends Specifier {
  async specify(): Promise<void> {
    await Promise.all([
      await this.installNodeModules(),
      await this.copyBrowserslistrc(),
      await this.copyEditorconfig(),
      await this.copyGitignore()
    ]);
    await this.initialCommit();
  }

  installNodeModules(): Promise<void> {
    return new Promise((resolve, reject) => {
      const npm: ChildProcess = spawn('npm', ['i'], this.childProcessOptions);

      npm.on('error', () => {
        reject(new Error(''));
      });

      npm.on('exit', () => {
        resolve();
      });
    }).then(() => console.log('node_modules successfully installed!'));
  }

  initialCommit(): Promise<void> {
    return new Promise((resolve, reject) => {
      const npm: ChildProcess = spawn('rm', ['-rf', '.git'], this.childProcessOptions);

      npm.on('error', (err) => {
        reject(new Error(`Initial commit error: ${err}`));
      });

      npm.on('exit', async () => {
        resolve();
      });
    }).then(() => super.initialCommit());
  }
}
