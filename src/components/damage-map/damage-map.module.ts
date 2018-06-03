import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DamageMap } from './damage-map';
import { MatExpansionModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Pipes } from '../../pipes/pipes.module';

@NgModule({
  declarations: [DamageMap],
  imports: [
    IonicPageModule.forChild(DamageMap),
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    Pipes
  ],
  exports: [DamageMap]
})
export class DamageMapModule {}
