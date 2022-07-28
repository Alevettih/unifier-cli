const inquirer: IInquirer = jest.genMockFromModule('inquirer');

interface IInquirer {
  prompt: (questions: any) => Promise<void>;
}

inquirer.prompt = async () => {
  return;
};

module.exports = inquirer;
