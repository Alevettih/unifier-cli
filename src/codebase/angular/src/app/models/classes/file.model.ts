import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ApiFile {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() originalName: string;
  @Expose() mimeType: string;
  @Expose() size: number;
  @Expose() private: boolean;
  @Expose()
  @Transform((value: Date): Date => new Date(value))
  createdAt: Date;
}
