import { Listr, ListrTask } from 'listr2';
import { IContext } from '@src/main';
import { TitleQuestion } from '@utils/questions/title.question';
import { TypeQuestion } from '@utils/questions/type.question';
import { VersionQuestion } from '@utils/questions/version.question';
import { PackageManagerQuestion } from '@utils/questions/package-manager.question';

export interface IQuestion {
  tasks: ListrTask[];
  prefix?: string;
}

export class Questions {
  private _titleQuestion: TitleQuestion = new TitleQuestion();
  private _typeQuestion: TypeQuestion = new TypeQuestion();
  private _versionQuestion: VersionQuestion = new VersionQuestion();
  private _packageManagerQuestion: PackageManagerQuestion = new PackageManagerQuestion();

  ask(): Listr<IContext> {
    return new Listr<IContext>(
      [...this.titleTasks, ...this.typeTasks, ...this.versionTasks, ...this.packageManagerTasks],
      { concurrent: false }
    );
  }

  get titleTasks(): ListrTask[] {
    return this._titleQuestion.tasks;
  }

  get typeTasks(): ListrTask[] {
    return this._typeQuestion.tasks;
  }

  get versionTasks(): ListrTask[] {
    return this._versionQuestion.tasks;
  }

  get packageManagerTasks(): ListrTask[] {
    return this._packageManagerQuestion.tasks;
  }
}
