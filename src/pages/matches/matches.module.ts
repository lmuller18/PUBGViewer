import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatchesPage } from './matches';

@NgModule({
  declarations: [MatchesPage],
  imports: [
    IonicPageModule.forChild(MatchesPage),
    MatCardModule,
    MatListModule,
    MatButtonModule
  ],
  exports: [MatchesPage]
})
export class ListMasterPageModule {}
