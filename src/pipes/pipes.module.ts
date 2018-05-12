import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DamageTypePipe } from './damageTypePipe.pipe';
import { KeysPipe } from './keysPipe.pipe';
import { TimePipe } from './timePipe.pipe';
@NgModule({
  declarations: [DamageTypePipe, KeysPipe, TimePipe],
  imports: [CommonModule],
  exports: [DamageTypePipe, KeysPipe, TimePipe]
})
export class Pipes {}
