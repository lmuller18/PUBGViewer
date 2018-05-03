import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material';
import { PlayerPage } from './player';

@NgModule({
  declarations: [PlayerPage],
  imports: [
    IonicPageModule.forChild(PlayerPage),
    MatButtonModule,
    MatExpansionModule
  ],
  exports: [PlayerPage]
})
export class PlayerModule {}
