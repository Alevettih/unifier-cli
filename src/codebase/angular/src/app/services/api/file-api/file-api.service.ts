import { Injectable } from '@angular/core';
import { ApiBaseAbstractService } from '@misc/abstracts/api-base.abstract.service';
import { ClassConstructor } from 'class-transformer';
import { IServicesConfig } from '@services/http/http.service';
import { Observable } from 'rxjs';
import { ApiFile } from '@models/classes/file.model';
import { toModel } from '@misc/rxjs-operators/to-model.operator';

@Injectable({
  providedIn: 'root'
})
export class FileApiService extends ApiBaseAbstractService<ApiFile> {
  protected readonly _URL_PATH: string = '/api/files';
  protected readonly _MODEL: ClassConstructor<ApiFile> = ApiFile;

  uploadMedia(file: File, servicesConfig?: IServicesConfig): Observable<ApiFile> {
    const body = new FormData();

    body.append('file', file);
    body.append('originalName', file.name);

    return this._http.post(`${this.url}/upload`, body, {}, servicesConfig).pipe(toModel(this._MODEL));
  }
}
