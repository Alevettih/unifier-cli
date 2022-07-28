import { ExecaReturnValue } from 'execa';

const execa: IExeca = jest.genMockFromModule('execa');

const command = jest.fn(async (command): Promise<ExecaReturnValue> => ({ command } as ExecaReturnValue));

interface IExeca {
  command: (cmd, options) => Promise<ExecaReturnValue>;
}

execa.command = command;

module.exports = execa;
