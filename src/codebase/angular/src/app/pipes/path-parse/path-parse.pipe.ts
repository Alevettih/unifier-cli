import { Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash';

@Pipe({
  name: 'pathParse'
})
export class PathParsePipe implements PipeTransform {
  transform(object: { [key: string]: any }, pathString: string): any {
    return get(object, pathString);
  }
}
