import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettifyUrl'
})
export class PrettifyUrlPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/(http(s)?:\/\/)?/gm, '').replace(/(\?.+)?/gm, '');
  }
}
