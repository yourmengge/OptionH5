import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round4'
})
export class Round4Pipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value !== '--' && value !== '' && value !== '-' && value !== 0) {
      return (Math.round(parseFloat(value) * 10000) / 10000).toFixed(4);
    } else {
      return value;
    }
  }

}
