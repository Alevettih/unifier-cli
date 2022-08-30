import { IAngularInfo } from '@src/main';
import { command } from 'execa';

export async function getAngularInfo(): Promise<IAngularInfo> {
  try {
    const commandRes = await command(`npm view @angular/cli --json`);
    const { 'dist-tags': tags, versions } = JSON.parse(commandRes.stdout);

    return { tags, versions };
  } catch (e) {
    return { tags: {}, versions: [] };
  }
}
