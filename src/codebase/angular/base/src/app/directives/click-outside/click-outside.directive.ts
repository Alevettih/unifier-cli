import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output() public clickOutside: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @HostListener('document:click', ['$event']) public onClick(event: MouseEvent): void {
    const clickedInside: boolean = (this._elementRef.nativeElement as HTMLElement).contains(event.target as HTMLElement);
    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }

  constructor(private _elementRef?: ElementRef) {}
}
