import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor(private _elementRef?: ElementRef) {}

  @HostListener('document:click', ['$event']) onClick(event: MouseEvent): void {
    const isClickedInside: boolean = (this._elementRef.nativeElement as HTMLElement).contains(event.target as HTMLElement);
    if (!isClickedInside) {
      this.clickOutside.emit(event);
    }
  }
}
