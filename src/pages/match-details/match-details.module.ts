import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchDetailsPage } from './match-details';
import { MatExpansionModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatchReplayModule } from '../../components/match-replay/match-replay.module';
import { Pipes } from '../../pipes/pipes.module';
import { DamageMapModule } from '../../components/damage-map/damage-map.module';

@NgModule({
  declarations: [MatchDetailsPage],
  imports: [
    IonicPageModule.forChild(MatchDetailsPage),
    MatchReplayModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    DamageMapModule,
    Pipes
  ],
  exports: [MatchDetailsPage]
})
export class MatchDetailsPageModule {}
