import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '@models/classes/_base.model';

@Exclude()
export class ApiFile extends BaseModel {
  @Expose() name: string;
  @Expose() originalName: string;
  @Expose() context: string;
  @Expose() path: string;
  @Expose() mimeType: string;
  @Expose() size: number;
  @Expose() uri: string;
}
