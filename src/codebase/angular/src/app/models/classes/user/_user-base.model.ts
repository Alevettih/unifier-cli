import { Exclude, Expose, Transform, TransformFnParams } from 'class-transformer';
import { UserRole } from '@models/enums/user-role.enum';
import { BaseModel } from '@models/classes/_base.model';
import { ApiFile } from '@models/classes/file.model';
import { transformToModel } from '@misc/helpers/model-conversion/transform-helpers/transform-to-model.function';

@Exclude()
export class UserBase extends BaseModel {
  @Expose()
  role: UserRole;
  @Expose()
  email: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  phone: string;
  @Expose()
  @Transform(transformToModel(ApiFile))
  avatar: ApiFile;
  @Expose({ name: 'emailVerified' })
  isEmailVerified: boolean;
  @Expose()
  @Transform(({ value, obj }: TransformFnParams): string => value ?? `${obj.firstName ?? ''} ${obj.lastName ?? ''}`.trim())
  fullName: string;
}
