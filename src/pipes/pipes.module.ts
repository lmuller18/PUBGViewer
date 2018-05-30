import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DamageTypePipe } from './damageTypePipe.pipe';
import { BodyPartPipe } from './bodyPartPipe.pipe';
import { KeysPipe } from './keysPipe.pipe';
import { TimePipe } from './timePipe.pipe';
@NgModule({
  declarations: [DamageTypePipe, BodyPartPipe, KeysPipe, TimePipe],
  imports: [CommonModule],
  exports: [DamageTypePipe, BodyPartPipe, KeysPipe, TimePipe]
})
export class Pipes {}
