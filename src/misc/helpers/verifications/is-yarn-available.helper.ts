import { command, ExecaReturnValue } from 'execa';

export async function isYarnAvailable(): Promise<boolean> {
  return command(`npm ls -g --json`).then(
    (result: ExecaReturnValue<any>) => {
      const jsonStr: string = result?.stdout;
      const json: any = jsonStr ? JSON.parse(jsonStr) : { dependencies: {} };
      return Object.keys(json.dependencies).includes('yarn');
    },
    () => {
      return false;
    }
  );
}
