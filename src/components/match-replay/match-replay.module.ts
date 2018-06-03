import { NgModule } from '@angular/core';
import { MatchReplay } from './match-replay';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [MatchReplay],
  imports: [IonicPageModule.forChild(MatchReplay)],
  exports: [MatchReplay]
})
export class MatchReplayModule {}
