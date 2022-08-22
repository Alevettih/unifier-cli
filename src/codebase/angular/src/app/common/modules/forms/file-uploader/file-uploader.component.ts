import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormFieldAbstractComponent } from '@misc/abstracts/base-form-field.abstract.component';
import { FormControl } from '@angular/forms';
import { FileType } from '@models/enums/file-type.enum';
import { ApiFile } from '@models/classes/file.model';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ThemePalette } from '@angular/material/core';
import { FileApiService } from '@services/api/file-api/file-api.service';
import { Observable, zip } from 'rxjs';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent extends BaseFormFieldAbstractComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @Output() fileDragover: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();
  @Output() fileDragleave: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();
  @Input() override control: FormControl;
  @Input() fileType: FileType[] = [FileType.any];
  @Input() multiple: boolean = true;
  @Input() maxCountFile: number = 10;
  @Input() maxSizeFile: number;
  @Input() previewHeight: number = 160;
  @Input() previewWidth: number = 225;
  @Input() actionsYPosition: 'start' | 'end' = 'end';
  @Input() actionsXPosition: 'start' | 'end' = 'end';
  @Input() actionsColor: ThemePalette = 'primary';
  filesOnLoading: Set<string> = new Set<string>();
  filesWithError: Set<string> = new Set<string>();
  selectFile: ApiFile[] = [];
  fileError: string = '';

  get isFileError(): boolean {
    return (this.control?.invalid && this.control?.touched) || !!this.fileError;
  }

  get fileErrorMessage(): string {
    if (this.fileError) {
      return this.fileError;
    }
    return this.errorMessage;
  }

  get valueControl(): File | File[] {
    return this.control?.value;
  }

  get actionsPositionClasses(): string[] {
    return [`file-uploader__file-actions_x-${this.actionsXPosition}`, `file-uploader__file-actions_y-${this.actionsYPosition}`];
  }

  get placeholderWord(): string {
    return this._translate.instant(`FILE_UPLOADER.FILE${this.multiple ? 'S' : ''}`);
  }

  constructor(
    private _fileApi: FileApiService,
    private _sanitizer: DomSanitizer,
    protected override _cdr: ChangeDetectorRef,
    protected override _translate: TranslateService
  ) {
    super(_cdr, _translate);
  }

  ngOnInit(): void {
    this.selectFile = this.valueControl ? (this.multiple ? (this.control.value as ApiFile[]) : [this.control.value]) : [];
  }

  getFiles(event: Event): File[] {
    return Array.from((event.target as HTMLInputElement).files ?? []).map((file: File): File => file);
  }

  fileChangeHandler(files: File[]): void {
    const filteredFiles: File[] = files.filter(
      (file: File): boolean =>
        this.fileType.some((ft: FileType): boolean => ft === FileType.any || ft.includes(file.type)) &&
        this.selectFile.every((sFile: ApiFile): boolean => !(sFile.name === file.name))
    );

    if (!this.multiple) {
      this.selectFile.length = 0;

      if (filteredFiles.length > 1) {
        filteredFiles.length = 1;
      }
    }

    this.selectFile.push(...(filteredFiles as any as ApiFile[]));
    this.fileUploadHandler(filteredFiles);
  }

  fileUploadHandler(files: File[]): void {
    zip(
      ...files.map((file: File): Observable<ApiFile> => {
        return this._fileApi.uploadMedia(file, { skipErrorNotification: true });
      })
    ).subscribe((apiFiles: ApiFile[]): void => {
      this.control.setValue(this.multiple ? apiFiles : apiFiles[0]);
    });
  }

  fileValidation(files: File[]): boolean {
    if (files.find((file: File): boolean => this._toMB(file.size) > this.maxSizeFile)?.size) {
      this.fileError = this._translate.instant('FILE_UPLOADER.FILE_SIZE', { size: this.maxSizeFile });
      return false;
    } else {
      this.fileError = '';
    }

    if (this.maxCountFile && this.maxCountFile < files.length) {
      this.fileError = this._translate.instant('FILE_UPLOADER.SELECTED_FILES_MAX', { count: this.maxCountFile });
      return false;
    } else {
      this.fileError = '';
    }

    return true;
  }

  removeFile(idx: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const haveBeenErrored: boolean = Boolean(this.fileError);
    this.filesWithError.delete(this.selectFile?.find?.((file: ApiFile, index: number): boolean => idx === index)?.originalName as string);
    this.selectFile = (this.selectFile as ApiFile[]).filter((file: ApiFile, index: number): boolean => idx !== index);
    this.control.setValue(
      this.control.value?.length ? this.control.value.filter((file: File, index: number): boolean => idx !== index) : null
    );
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = this.control.value?.length
        ? this.control.value.filter((file: File, index: number): boolean => idx !== index)
        : null;
    }
    if (haveBeenErrored && this.fileValidation(this.selectFile as any as File[])) {
      this.fileUploadHandler(this.selectFile as any as File[]);
    }
  }

  isFileMaxSize(file: ApiFile | File): boolean {
    return this._toMB(file.size) > this.maxSizeFile;
  }

  chooseAnotherFile(): void {
    this.fileInput?.nativeElement.dispatchEvent(new MouseEvent('click'));
  }

  getNativeFileUrl(file: ApiFile | File): string {
    if (file instanceof ApiFile) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(file.path) as string;
    }

    return this._sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file)) as string;
  }

  protected _toMB(size: number): number {
    return size / 1024 ** 2;
  }
}
