import { Exclude, Expose } from 'class-transformer';

export interface ApiTokens {
  access_token: string;
  refresh_token: string;
}

@Exclude()
export class Tokens {
  @Expose({ name: 'access_token' })
  access: string;
  @Expose({ name: 'refresh_token' })
  refresh: string;
}
