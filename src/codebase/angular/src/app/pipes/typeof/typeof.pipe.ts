import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeof'
})
export class TypeofPipe implements PipeTransform {
  transform(item: any, type: string): boolean {
    let res: boolean;

    if (type.includes('object')) {
      res = item && typeof item === 'object' && !Array.isArray(item);
    } else if (type.includes('null')) {
      res = !item && typeof item === 'object' && !(item instanceof Object);
    } else if (type.includes('array')) {
      res = item && Array.isArray(item);
    } else if (type.includes('integer')) {
      res = Number.isInteger(item);
    } else {
      res = typeof item === type.split('-').slice(-1)[0];
    }

    return type.includes('not-') ? !res : res;
  }
}
