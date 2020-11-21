import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Token {
  @Expose({ name: 'access_token' })
  access: string;
  @Expose({ name: 'refresh_token' })
  refresh: string;
}
