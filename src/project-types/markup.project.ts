import { IContext } from '@src/main';
import { Listr } from 'listr2';
import { MarkupSpecifier } from '@specifier/markup.specifier';
import { join } from 'path';
import { command } from 'execa';

export const markupProject = (context: IContext): Listr => {
  const { title } = context;

  return new Listr([
    {
      title: 'Install Markup project',
      task: () => command(`git clone https://github.com/Alevettih/markup-builder-webpack.git ${join(title)}`)
    },
    {
      title: 'Specify it',
      task: () => new MarkupSpecifier(context).specify()
    }
  ]);
};
