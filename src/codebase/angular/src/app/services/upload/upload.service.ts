import { Injectable } from '@angular/core';
import { HttpClient, HttpProgressEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { ApiBaseAbstractService } from '@misc/abstracts/api-base.abstract.service';
import { NotificationService } from '@services/notification/notification.service';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { FileResponse } from '@models/classes/file-response.model';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarNotificationType } from '@models/enums/snack-bar-notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  key: string = 'FILE.';
  constructor(
    private http: HttpClient,
    private api: ApiBaseAbstractService<FileResponse>,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}
  private urlPath: string = '/api/files';
  private showNotifications: boolean;

  public upload(
    files: Array<File> | File,
    urlPath: string = this.urlPath,
    withNotifications?: boolean
  ): Observable<FileResponse[] | FileResponse> {
    const errMessage: string = this.translateService.instant(`${this.key}SELECT_ONE_FILE`);
    this.showNotifications = withNotifications;

    if (Array.isArray(files)) {
      if (files?.length === 1) {
        if (this.showNotifications) {
          this.notificationService.show(this.translateService.instant(`${this.key}UPLOADING`), SnackBarNotificationType.success);
        }
        return this.uploadFile(files[0], urlPath, false);
      } else {
        if (this.showNotifications) {
          this.notificationService.show(this.translateService.instant(`${this.key}UPLOADING`), SnackBarNotificationType.success);
        }
        return this.uploadMultipleFiles(files, urlPath);
      }
    }

    if (files instanceof File) {
      if (this.showNotifications) {
        this.notificationService.show(this.translateService.instant(`${this.key}UPLOADING`), SnackBarNotificationType.success);
      }
      return this.uploadFile(files, urlPath, false);
    }

    this.notificationService.show(errMessage, SnackBarNotificationType.error);
    return throwError(errMessage);
  }

  public uploadFile(file: File, urlPath: string, isMultiple: boolean = false): Observable<FileResponse> {
    const fullUrl: string = `${this.api.baseUrl}${urlPath}`;
    const fd: FormData = new FormData();

    fd.append('file', file);
    fd.append('thumbnail', String(file.type.includes('image/')));

    return this.http.request(new HttpRequest('POST', fullUrl, fd, { reportProgress: true })).pipe(
      filter((event: HttpProgressEvent | HttpResponse<FileResponse>): boolean => event instanceof HttpResponse),
      map((res: HttpResponse<any>): any => {
        if (!isMultiple) {
          if (this.showNotifications) {
            this.notificationService.show(this.translateService.instant(`${this.key}UPLOADING_SUCCESS`), SnackBarNotificationType.success);
          }
        }
        return res.body;
      }),
      catchError(
        (err: string): Observable<never> => {
          if (!isMultiple) {
            return this.errorHandler(err);
          }
          return throwError(err);
        }
      )
    );
  }

  private uploadMultipleFiles(files: Array<File>, urlPath: string): Observable<FileResponse[]> {
    const requests: Observable<FileResponse>[] = [...Array.from(files)].map(
      (item: File): Observable<FileResponse> => this.uploadFile(item, urlPath, true)
    );

    return forkJoin(requests).pipe(
      map((res: FileResponse[]): FileResponse[] => {
        if (res.every((item: FileResponse): boolean => item instanceof Error)) {
          this.notificationService.show(this.translateService.instant(`${this.key}FILES_UPLOAD_FILED`), SnackBarNotificationType.error);
        } else if (res.some((item: FileResponse): boolean => item instanceof Error)) {
          this.notificationService.show(this.translateService.instant(`${this.key}SOME_UPLOAD_FILED`), SnackBarNotificationType.error);
        } else if (res.every((item: FileResponse): boolean => !(item instanceof Error))) {
          if (this.showNotifications) {
            this.notificationService.show(
              this.translateService.instant(`${this.key}FILES_UPLOADING_SUCCESS`),
              SnackBarNotificationType.success
            );
          }
        }
        return res.filter((item: FileResponse): boolean => !(item instanceof Error));
      })
    );
  }

  private errorHandler(error: string): Observable<never> {
    if (error) {
      this.notificationService.show(this.translateService.instant(`${this.key}UPLOAD_FILED`), SnackBarNotificationType.error);
    }
    return throwError(error);
  }
}
