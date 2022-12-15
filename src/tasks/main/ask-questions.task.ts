import { Listr } from 'listr2';
import { IAppContext } from '@interface/app-context.interface';
import { TitleQuestion } from '@modules/questions/title.question';
import { TypeQuestion } from '@modules/questions/type.question';
import { VersionQuestion } from '@modules/questions/version.question';
import { PackageManagerQuestion } from '@modules/questions/package-manager.question';
import { ApplicationQuestion } from '@modules/questions/application.question';

export function askQuestionsTask(): Listr<IAppContext> {
  const titleQuestion: TitleQuestion = new TitleQuestion();
  const typeQuestion: TypeQuestion = new TypeQuestion();
  const versionQuestion: VersionQuestion = new VersionQuestion();
  const packageManagerQuestion: PackageManagerQuestion = new PackageManagerQuestion();
  const applicationTypesQuestion: ApplicationQuestion = new ApplicationQuestion();

  return new Listr<IAppContext>(
    [
      ...titleQuestion.tasks,
      ...typeQuestion.tasks,
      ...versionQuestion.tasks,
      ...packageManagerQuestion.tasks,
      ...applicationTypesQuestion.tasks
    ],
    { concurrent: false }
  );
}
