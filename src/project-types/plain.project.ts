import { Answer } from "@src/main";
import { PlainJSSpecifier } from "@specifier/plain-js.specifier";
import { ChildProcess, spawn } from "child_process";
import { join } from "path";

export const plainProject = ({ title } = { title: '' } as Answer): void => {
  const npx: ChildProcess = spawn(
    'git',
    ['clone', 'git@gitlab.requestum.com:Tykhonenko/project-template-gulp.git', join(title)],
    {stdio: "inherit"}
  );

  npx.on('error', (e) => {
    throw new Error(`Cloning of Plain JS project was fell ${e}`);
  });

  npx.on('exit', async () => {
    await new PlainJSSpecifier(title).specify();
  });
};
