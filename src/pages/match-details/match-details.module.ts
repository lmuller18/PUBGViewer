import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchDetailsPage } from './match-details';
import { MatExpansionModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [MatchDetailsPage],
  imports: [
    IonicPageModule.forChild(MatchDetailsPage),
    MatExpansionModule,
    MatListModule,
    MatIconModule
  ],
  exports: [MatchDetailsPage]
})
export class MatchDetailsPageModule {}
