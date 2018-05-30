import { Pipe, PipeTransform } from '@angular/core';
import { DamageReasonNames } from '../providers/providers';

@Pipe({ name: 'bodyPartPipe' })
export class BodyPartPipe implements PipeTransform {
  transform(value: string): string {
    return DamageReasonNames[value];
  }
}
