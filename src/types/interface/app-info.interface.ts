import { AppType } from '@src/types/type/app-type.type';

export interface IAppInfo {
  name: AppType;
  token: `token.${AppType}.json`;
  port: number;
}
