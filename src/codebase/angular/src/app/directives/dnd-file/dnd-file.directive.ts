import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dndFile]'
})
export class DndFileDirective {
  @HostBinding('class.file-over') fileOver: boolean;
  @Output() fileDropped: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() fileDragover: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();
  @Output() fileDragleave: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) ondrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    const files: File[] = Array.prototype.map.call(event.dataTransfer.files, (file: File): File => file);
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
