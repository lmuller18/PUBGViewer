import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timePipe' })
export class TimePipe implements PipeTransform {
  transform(value: string): string {
    const sec_num = parseInt(value, 10); // don't forget the second param
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - hours * 3600) / 60);
    let hoursString = `${hours}`;
    let minutesString = `${minutes}`;
    if (hours < 10) {
      hoursString = '0' + hours;
    }
    if (minutes < 10) {
      minutesString = '0' + minutes;
    }
    return `${hoursString}h ${minutesString}mn`;
  }
}
