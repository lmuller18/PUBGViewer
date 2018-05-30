import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { PlayerPage } from './player';
import { Pipes } from '../../pipes/pipes.module';

@NgModule({
  declarations: [PlayerPage],
  imports: [
    IonicPageModule.forChild(PlayerPage),
    MatButtonModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    Pipes
  ],
  exports: [PlayerPage]
})
export class PlayerModule {}
