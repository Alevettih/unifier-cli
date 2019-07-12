import { ExecaReturnValue } from 'execa';

const execa: Execa = jest.genMockFromModule('execa');

const command = jest.fn(
  async (cmd, options): Promise<ExecaReturnValue> =>
    ({
      command: cmd
    } as ExecaReturnValue)
);

interface Execa {
  command: (cmd, options) => Promise<ExecaReturnValue>;
}

execa.command = command;

module.exports = execa;
