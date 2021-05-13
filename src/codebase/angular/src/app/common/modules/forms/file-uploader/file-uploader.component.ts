import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UploadService } from '@services/upload/upload.service';
import { FormControl } from '@angular/forms';
import { FileResponse } from '@models/classes/file-response.model';
import { FileType } from '@models/enums/file-type.enum';
import { BaseFormFieldAbstractComponent } from '@misc/abstracts/base-form-field.abstract.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiFile } from '@models/classes/file.model';
import { Params } from '@angular/router';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent extends BaseFormFieldAbstractComponent implements OnInit {
  @Input() control: FormControl;
  @Input() fileType: FileType[] = [FileType.any];
  @Input() iconSrcDownloadLink: string;
  @Input() isDownloadButton: boolean = false;
  @Input() textDownloadLink: string = 'BUTTON_NAME.DOWNLOAD_CONTRACT';
  @Input() textTemplateDownloadLink: string = 'BUTTON_NAME.DOWNLOAD_CONTRACT_TEMPLATE';
  @Input() iconSrcDownloadPanel: string = 'document';
  @Input() textDownloadPanel: string = 'BUTTON_NAME.ATTACH_FILE';
  @Input() multiple: boolean = true;
  @Input() maxCountFile: number = 10;
  @Input() maxSizeFile: number;
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

  constructor(private uploadService: UploadService, protected cdr: ChangeDetectorRef, protected translate: TranslateService) {
    super(cdr, translate);
  }

  ngOnInit(): void {
    this.selectFile = this.valueControl ? (this.multiple ? (this.control.value as ApiFile[]) : [this.control.value]) : [];
  }

  getFiles(event: Event): File[] {
    console.log((event.target as HTMLInputElement).files);
    return Array.prototype.map.call((event.target as HTMLInputElement).files, (file: File): File => file);
  }

  fileChangeHandler(files: File[]): void {
    const filteredFiles: File[] = files.filter(
      (file: File): boolean =>
        this.fileType.some((ft: FileType): boolean => ft === FileType.any || ft.includes(file.type)) &&
        this.selectFile.every((sFile: ApiFile): boolean => !(sFile.name === file.name))
    );

    if (!this.multiple) {
      this.selectFile.length = 0;
    }

    this.selectFile.push(...((filteredFiles as any) as ApiFile[]));
    this.fileUploadHandler(filteredFiles);
  }

  fileUploadHandler(files: File[]): void {
    if (files.length && this.fileValidation(files)) {
      const filesItem: File[] = Array.prototype.map.call(files, (file: File): File => file);
      this.uploadService.upload(filesItem).subscribe((response: FileResponse): any => {
        if (this.multiple) {
          this.control.setValue(this.control.value ? [].concat(this.control.value, response?.uploaded) : response?.uploaded);
        } else {
          this.control.setValue(response?.uploaded?.[0]);
        }
        this.fileError = response?.failed?.map((failed: Params): string => failed?.error?.message ?? '').join(' ,');
      });
    }
  }

  fileValidation(files: File[]): boolean {
    if (files.find((file: File): boolean => this.toMB(file.size) > this.maxSizeFile)?.size) {
      this.fileError = this.translate.instant('FILE.FILE_SIZE', { size: this.maxSizeFile });
      return false;
    } else {
      this.fileError = '';
    }

    if (this.maxCountFile && this.maxCountFile < files.length) {
      this.fileError = this.translate.instant('FILE.SELECTED_FILES_MAX', { count: this.maxCountFile });
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
    this.selectFile = (this.selectFile as ApiFile[]).filter((file: ApiFile, index: number): boolean => idx !== index);
    this.control.setValue(
      this.control.value?.length ? this.control.value.filter((file: File, index: number): boolean => idx !== index) : null
    );
    if (haveBeenErrored && this.fileValidation((this.selectFile as any) as File[])) {
      this.fileUploadHandler((this.selectFile as any) as File[]);
    }
  }

  isFileMaxSize(file: ApiFile | File): boolean {
    return this.toMB(file.size) > this.maxSizeFile;
  }

  protected toMB(size: number): number {
    return size / 1024 ** 2;
  }
}
