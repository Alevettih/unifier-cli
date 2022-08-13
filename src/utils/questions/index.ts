import { Listr, ListrTask } from 'listr2';
import { IContext } from '@src/main';
import { TitleQuestion } from '@utils/questions/title.question';
import { TypeQuestion } from '@utils/questions/type.question';
import { VersionQuestion } from '@utils/questions/version.question';
import { PackageManagerQuestion } from '@utils/questions/package-manager.question';
import { ApplicationQuestion } from '@utils/questions/application.question';

export interface IQuestion {
  tasks: ListrTask[];
}

export class Questions {
  private _titleQuestion: TitleQuestion = new TitleQuestion();
  private _typeQuestion: TypeQuestion = new TypeQuestion();
  private _versionQuestion: VersionQuestion = new VersionQuestion();
  private _packageManagerQuestion: PackageManagerQuestion = new PackageManagerQuestion();
  private _applicationTypesQuestion: ApplicationQuestion = new ApplicationQuestion();

  ask(): Listr<IContext> {
    return new Listr<IContext>(
      [
        ...this.titleTasks,
        ...this.typeTasks,
        ...this.versionTasks,
        ...this.packageManagerTasks,
        ...this.applicationTypesTasks
      ],
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

  get applicationTypesTasks(): ListrTask[] {
    return this._applicationTypesQuestion.tasks;
  }
}
