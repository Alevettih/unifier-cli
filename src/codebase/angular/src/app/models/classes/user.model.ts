import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '@models/enums/user-role.enum';

@Exclude()
export class User {
  @Expose()
  id: string;
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
  role: UserRole;
}
