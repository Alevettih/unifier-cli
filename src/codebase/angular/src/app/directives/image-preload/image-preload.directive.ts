import { Directive, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiFile } from '@models/classes/file.model';
import { FileApiService } from '@services/api/file-api/file-api.service';
import { map } from 'rxjs/operators';

@Directive({
  selector: 'img[apiFile]'
})
export class ImagePreloadDirective implements OnChanges {
  @Input() apiFile: ApiFile;
  @HostBinding('src') src: string | SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer, private fileApi: FileApiService) {}

  ngOnChanges({ apiFile }: SimpleChanges): void {
    if (apiFile?.currentValue) {
      this.fileApi
        .getFile(apiFile.currentValue)
        .pipe(map((file: File): string => window.URL.createObjectURL(file)))
        .subscribe((url: string): void => {
          this.src = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        });
    } else {
      this.src = '';
    }
  }
}
