import { Answer } from "@src/main";
import { spawn } from "child_process";
import { ReactSpecifier } from "@specifier/react.specifier";

export const reactProject = ({ title } = { title: '' } as Answer): void => {
  if (!title) {
    throw new Error('Title is required!')
  }

  const npx = spawn(
    'npx',
    ['create-react-app', title],
    {stdio: "inherit"}
  );

  npx.on('error', (e) => {
    throw new Error(`create-react-app CLI was fell: ${e}`);
  });

  npx.on('exit', async () => {
    await new ReactSpecifier(title).specify();
  });
};
