import { Observable } from 'rxjs';
import { IAppContext } from '@interface/app-context.interface';
import { commandWithOutput } from '@helpers/command-with-output.helper';

export function runPrettierTask({ childProcessOptions }: IAppContext): Observable<string> {
  return commandWithOutput(
    'node ./node_modules/prettier/bin-prettier "./src/**/*.{js,ts,html}" --write',
    Object.assign({ preferLocal: true }, childProcessOptions)
  );
}
