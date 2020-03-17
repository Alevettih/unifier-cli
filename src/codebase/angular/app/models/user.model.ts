import { Exclude, Expose } from 'class-transformer';

export enum Role {
  admin = 'admin'
}

@Exclude()
export class User {
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  phone: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  createdAt: string;
  @Expose()
  role: Role;
}
