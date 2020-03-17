import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pathToName'
})
export class PathToNamePipe implements PipeTransform {
  transform(pathString: string): string {
    return pathString.replace(/\[\d+]/gm, '');
  }
}
