import { Directive, Input, HostBinding, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Directive({
  selector: 'img[placeholder]'
})
export class ImagePlaceholderDirective implements OnChanges {
  @Input() placeholder: string;
  @Input() src: string | ArrayBuffer;
  @HostBinding('src') url: string | SafeResourceUrl;
  @HostListener('error') updateUrl(): void {
    this.url = this.placeholder;
  }

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnChanges({ src }: SimpleChanges): void {
    if (src?.currentValue) {
      this.url = this._sanitizer.bypassSecurityTrustResourceUrl(src.currentValue);
    } else {
      this.url = '';
    }
  }
}
