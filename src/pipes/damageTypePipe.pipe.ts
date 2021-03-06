import { Pipe, PipeTransform } from '@angular/core';
import { DamageCauserNames } from '../providers/providers';

@Pipe({ name: 'damageTypePipe' })
export class DamageTypePipe implements PipeTransform {
  transform(value: string): string {
    return DamageCauserNames[value];
  }
}
