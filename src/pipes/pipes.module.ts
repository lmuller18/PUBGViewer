import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DamageTypePipe } from './damageTypePipe.pipe';

@NgModule({
  declarations: [DamageTypePipe],
  imports: [CommonModule],
  exports: [DamageTypePipe]
})
export class Pipes {}
