import { ListrOptions, ListrTask } from 'listr';

class ListrMock {
  tasks: ListrTask[];
  run = jest.fn(() =>
    this.tasks.forEach(({ task, skip }) => {
      // @ts-ignore
      if (skip && skip()) {
        return;
      }

      // @ts-ignore
      task();
    })
  );

  constructor(tasks: ListrTask[], options: ListrOptions) {
    this.tasks = tasks;
    this.run();
  }
}

module.exports = ListrMock;
