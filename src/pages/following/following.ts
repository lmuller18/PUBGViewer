import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import * as fromViewer from '../../store';
import { LoadPlayer } from '../../store';

@IonicPage()
@Component({
  selector: 'page-following',
  templateUrl: 'following.html'
})
export class FollowingPage {
  player: any;
  following: any[];

  constructor(
    private navCtrl: NavController,
    private auth: AuthService,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.player = this.auth.getUserPlayer();
    this.following = this.auth.getFollowing();
  }

  toFavorite(player) {
    this.store.dispatch(new LoadPlayer(player));
  }
}
