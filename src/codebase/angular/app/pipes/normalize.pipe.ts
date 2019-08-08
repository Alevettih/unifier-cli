import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalize'
})
export class NormalizePipe implements PipeTransform {
  transform(value: any): string {
    return `${value || Number.isInteger(value) ? `${value}` : ''}`.replace(/_/g, ' ').replace(/([A-Z][^A-Z])/g, ' $1');
  }
}
