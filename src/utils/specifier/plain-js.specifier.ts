import { Specifier } from "@specifier/index";
import { spawn } from "child_process";
import { join } from "path";

export class PlainJSSpecifier extends Specifier {
  async specify() {
    await Promise.all([
      await this.installNodeModules(),
      await this.copyBrowserslistrc(),
      await this.copyEditorconfig(),
      await this.copyGitignore()
    ]);
    await this.initialCommit();
  }

  installNodeModules() {
    return new Promise(((resolve, reject) => {
      const npm = spawn('npm', ['i'], { cwd: join(this.name), stdio: "inherit" })

      npm.on('error', () => {
        reject(new Error(''))
      });

      npm.on('exit', () => {
        console.log('node_modules successfully installed!');
        resolve();
      })
    }))
  }

  async initialCommit() {
    return new Promise(((resolve, reject) => {
      const npm = spawn('rm', ['-rf', '.git'], { cwd: join(this.name), stdio: "inherit" });

      npm.on('error', () => {
        reject(new Error(''))
      });

      npm.on('exit', async () => {
        await super.initialCommit();
        resolve();
      })
    }))
  }
}
