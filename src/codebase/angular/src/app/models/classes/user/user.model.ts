import { Exclude } from 'class-transformer';
import { UserBase } from '@models/classes/user/_user-base.model';

@Exclude()
export class User extends UserBase {}
