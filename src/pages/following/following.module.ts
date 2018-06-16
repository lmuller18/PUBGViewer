import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { FollowingPage } from './following';

@NgModule({
  declarations: [FollowingPage],
  imports: [
    IonicPageModule.forChild(FollowingPage),
    MatCardModule,
    MatListModule,
    MatButtonModule
  ],
  exports: [FollowingPage]
})
export class FollowingPageModule {}
