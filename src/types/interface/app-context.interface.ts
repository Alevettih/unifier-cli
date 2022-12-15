import { ProjectType } from '@src/types/enum/project-type.enum';
import { PackageManager } from '@src/types/type/package-manager.type';
import { IAppInfo } from '@src/types/interface/app-info.interface';
import { AppType } from '@src/types/type/app-type.type';
import { IAngularInfo } from '@src/types/interface/angular-info.interface';
import { ICodebaseInfo } from '@interface/codebase-info.interface';
import { Options } from 'execa';
import { IProjectDirectories } from '@interface/directories.interface';

export interface IAppContext {
  port: number;
  isYarnAvailable: boolean;
  title: string;
  version: string;
  type: ProjectType;
  packageManager: PackageManager;
  applicationsInfo: IAppInfo[];
  codebaseInfo: ICodebaseInfo;
  applications: AppType[];
  angularInfo: IAngularInfo;
  lintersKeys: string[];
  skipGit: boolean;
  readonly childProcessOptions: Options;
  readonly ngCommand: string;
  readonly directories: IProjectDirectories;
}
