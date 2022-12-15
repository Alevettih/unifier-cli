import { ListrTask, ListrTaskWrapper } from 'listr2';
import { IAppContext } from '@src/types/interface/app-context.interface';

export abstract class AbstractQuestion<T> {
  abstract get tasks(): ListrTask[];
  protected abstract get _title(): string;
  protected abstract _ask(task: ListrTaskWrapper<IAppContext, any>, ctx?: IAppContext): Promise<T>;
}
