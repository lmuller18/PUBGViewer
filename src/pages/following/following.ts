import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
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
  followingLoaded = false;

  constructor(
    private auth: AuthService,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.player = this.auth.getUserPlayer();
    this.following = this.auth.getFollowing();
    let index = 1;
    if (this.following) {
      this.following.forEach(favorite => {
        favorite.portrait = index;
        index === 4 ? (index = 1) : index++;
      });
      console.log(this.following);
      this.followingLoaded = true;
    }
  }

  toFavorite(player) {
    this.store.dispatch(new LoadPlayer(player));
  }
}
