import { Inject, Injectable } from '@angular/core';
import { ApiBaseAbstractService } from '@misc/abstracts/api-base.abstract.service';
import { ClassConstructor } from 'class-transformer';
import { FileResponse } from '@models/classes/file-response.model';
import { Observable, BehaviorSubject, zip } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ApiFile } from '@models/classes/file.model';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';
import { HttpService } from '@services/http/http.service';
import { PathParsePipe } from '@pipes/path-parse/path-parse.pipe';

@Injectable({
  providedIn: 'root'
})
export class FileApiService extends ApiBaseAbstractService<FileResponse> {
  protected readonly DOWNLOADED_IMAGES$: Map<string, BehaviorSubject<File>> = new Map<string, BehaviorSubject<File>>();
  protected MODEL: ClassConstructor<FileResponse> = FileResponse;
  protected URLPath: string = '/api/file';

  constructor(@Inject(APP_CONFIG) protected config: IAppConfig, protected http: HttpService, protected pathParsePipe: PathParsePipe) {
    super(config, http, pathParsePipe);
  }

  getFile({ id, originalName }: ApiFile): Observable<File> {
    if (this.DOWNLOADED_IMAGES$.has(id)) {
      const subject$: BehaviorSubject<File> = this.DOWNLOADED_IMAGES$.get(id);
      return subject$.value ? subject$ : subject$.pipe(filter((file: File): boolean => Boolean(file)));
    }

    this.DOWNLOADED_IMAGES$.set(id, new BehaviorSubject(null));

    return this.http.get(`${this.baseUrl}/api/files/${id}`, { responseType: 'blob' }, { skipLoaderStart: true }).pipe(
      map((blob: Blob): File => new File([blob], originalName)),
      tap((url: File): void => {
        this.DOWNLOADED_IMAGES$.get(id).next(url);
      })
    );
  }

  getFiles(files: ApiFile[]): Observable<File[]> {
    return zip(...files.map((apiFile: ApiFile): Observable<File> => this.getFile(apiFile)));
  }

  downloadFiles(files: ApiFile[]): void {
    this.getFiles(files).subscribe((data: File[]): void => {
      data.forEach((file: File): void => {
        const url: string = window.URL.createObjectURL(file);
        const a: HTMLAnchorElement = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = `${file.name}`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
    });
  }
}
