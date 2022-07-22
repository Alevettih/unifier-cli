import { ExecaReturnValue } from 'execa';

const execa: Execa = jest.genMockFromModule('execa');

const command = jest.fn(async (command): Promise<ExecaReturnValue> => ({ command } as ExecaReturnValue));

interface Execa {
  command: (cmd, options) => Promise<ExecaReturnValue>;
}

execa.command = command;

module.exports = execa;
