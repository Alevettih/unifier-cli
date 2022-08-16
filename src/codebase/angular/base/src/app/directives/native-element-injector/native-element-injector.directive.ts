import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[ngModel], [formControl]'
})
export class NativeElementInjectorDirective implements OnChanges {
  @Input() formControl: AbstractControl;

  constructor(private _el: ElementRef) {}

  ngOnChanges({ formControl }: SimpleChanges): void {
    if (formControl?.currentValue) {
      (formControl.currentValue as any).nativeElement = this._el.nativeElement;
    }
  }
}
