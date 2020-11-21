import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'cropped-text',
  templateUrl: './cropped-text.component.html',
  styleUrls: ['./cropped-text.component.scss']
})
export class CroppedTextComponent implements AfterViewInit {
  @ViewChild('viewedText') viewedText: ElementRef<HTMLSpanElement>;
  @Input() text: string = '';

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  shouldShowTooltip(): boolean {
    return (this.elementRef?.nativeElement?.offsetWidth ?? 0) < (this.viewedText?.nativeElement?.offsetWidth ?? 0);
  }

  tooltipText(): string {
    return this.shouldShowTooltip() ? this.text : null;
  }
}
