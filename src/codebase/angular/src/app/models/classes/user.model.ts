import { Exclude, Expose, Transform, TransformFnParams } from 'class-transformer';
import { UserRole } from '@models/enums/user-role.enum';
import { BaseModel } from '@models/classes/_base.model';

@Exclude()
export class User extends BaseModel {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  role: UserRole;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  @Transform(({ value, obj }: TransformFnParams): string => value ?? `${obj.firstName ?? ''} ${obj.lastName ?? ''}`.trim())
  fullName: string;
}
