import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output() public clickOutside = new EventEmitter<MouseEvent>();
  @HostListener('document:click', ['$event']) public onClick(event: MouseEvent): void {
    const clickedInside: boolean = (this.elementRef.nativeElement as HTMLElement).contains(event.target as HTMLElement);
    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }

  constructor(private elementRef?: ElementRef) {}
}
