export interface IPerson {
  name: string;
  email: string;
  url: string;
}

export interface ILink {
  type: string;
  url: string;
}

export interface IFunding extends ILink {}
export interface IRepository extends ILink {
  directory?: string;
}

export interface IUnknownParams<T = string> {
  [key: string]: T;
}

type PersonString<name extends string, email extends string, url extends string> =
  | `${name}`
  | `${name} (${url})`
  | `${name} <${email}>`
  | `${name} <${email}> (${url})`;

export interface IPackageJson {
  name: string;
  version: string;
  description: string;
  keywords: string;
  homepage: string;
  bugs: {
    url: string;
    email: string;
  };
  license: string;
  private: boolean;
  author: IPerson | PersonString<string, string, string>;
  contributors: IPerson[];
  funding: (IFunding | string) | (IFunding | string)[];
  files: string[];
  main: string;
  browser: boolean;
  bin: IUnknownParams;
  man: string | string[];
  directories: {
    bin: string;
    man: string;
  };
  repository: IRepository | string;
  scripts: IUnknownParams;
  config: IUnknownParams;
  publishConfig: IUnknownParams;
  dependencies: IUnknownParams;
  devDependencies: IUnknownParams;
  peerDependencies: IUnknownParams;
  peerDependenciesMeta: {
    [key: string]: {
      optional: boolean;
    };
  };
  bundleDependencies: string[];
  optionalDependencies: IUnknownParams;
  overrides: IUnknownParams<string | IUnknownParams<string | IUnknownParams>>;
  engines: IUnknownParams;
  os: string[];
  cpu: string[];
  workspaces: string[];
}
