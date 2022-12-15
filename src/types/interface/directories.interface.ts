interface IDirectories {
  tmp: string;
  misc: string;
  files: string;
  templates: string;
  codebase: string;
  configs: string;
}

export interface IProjectDirectories {
  base: IDirectories;
  webpack: Pick<IDirectories, 'templates' | 'files'>;
  angular: Pick<IDirectories, 'templates' | 'configs'>;
}
