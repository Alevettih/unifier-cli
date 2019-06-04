const inquirer: Inquirer = jest.genMockFromModule('inquirer');

interface Inquirer {
  prompt: (questions: any) => Promise<void>;
}

inquirer.prompt = async (questions) => {
  return;
};

module.exports = inquirer;
