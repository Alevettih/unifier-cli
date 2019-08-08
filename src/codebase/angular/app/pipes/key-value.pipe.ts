import { Pipe, PipeTransform } from '@angular/core';

interface KeyValueItem {
  key: string;
  value: any;
}

interface KeyValueInputItem {
  [key: string]: any;
}

@Pipe({
  name: 'keyValue'
})
export class KeyValuePipe implements PipeTransform {
  transform(obj: KeyValueInputItem): KeyValueItem[] {
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
  }
}
