import { Exclude, Expose, Transform, TransformFnParams } from 'class-transformer';
import { Params } from '@angular/router';
import { convertToModelsArray } from '@misc/helpers/model-conversion/convert-to-models-array';
import { ApiFile } from '@models/classes/file.model';

@Exclude()
export class FileResponse {
  @Expose() failed: Params[];
  @Transform(({ value }: TransformFnParams): ApiFile[] => convertToModelsArray(value, ApiFile))
  @Expose()
  uploaded: ApiFile[];
}
