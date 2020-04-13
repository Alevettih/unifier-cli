import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pathParse'
})
export class PathParsePipe implements PipeTransform {
  transform(object: { [key: string]: any }, pathString: string): any {
    const itemsPaths: string[] = pathString.split('+');
    const result: { [key: string]: any }[] = [];
    for (let itemPath of itemsPaths) {
      itemPath = itemPath.replace(/\[(\w+)]/g, '.$1');
      itemPath = itemPath.replace(/^\./, '');
      const keys: string[] = itemPath.split('.');
      let value: { [key: string]: any } = object;

      for (const key of keys) {
        if (key in value) {
          value = value[key];
        } else {
          return;
        }
      }

      result.push(value);
    }

    return result.length > 1 ? result.join(', ') : result[0];
  }
}
