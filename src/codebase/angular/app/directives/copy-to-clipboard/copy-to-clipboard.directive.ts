import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

type Listener = (e: ClipboardEvent) => void;

@Directive({ selector: '[copy-to-clipboard]' })
export class CopyToClipboardDirective {
  @Input('copy-to-clipboard') public payload: string;

  @Output() public copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.payload) {
      return;
    }

    const listener: Listener = (e: ClipboardEvent): void => {
      const clipboard: DataTransfer = e.clipboardData;
      clipboard.setData('text', this.payload.toString());
      e.preventDefault();

      this.copied.emit(this.payload);
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }
}
