import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dndFile]'
})
export class DndFileDirective {
  @HostBinding('class.file-over') isFileOver: boolean;
  @Output() fileDropped: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() fileDragover: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();
  @Output() fileDragleave: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFileOver = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFileOver = false;
  }

  @HostListener('drop', ['$event']) ondrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFileOver = false;
    const files: File[] = Array.from(event.dataTransfer.files).map((file: File): File => file);
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
