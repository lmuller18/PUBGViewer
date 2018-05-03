import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import * as fromViewer from '../../store';
import { filter } from 'rxjs/operators';
import { Tab1Root } from '../pages';

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html'
})
export class PlayerPage implements OnInit {
  player$: Observable<any>;
  player: any;
  playerDetails$: Observable<any>;
  playerDetails: any;

  constructor(
    public navCtrl: NavController,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.playerDetails$ = this.store.pipe(
      select(fromViewer.getPlayerDetails),
      filter(Boolean)
    );
    this.player$ = this.store.pipe(
      select(fromViewer.getPlayer),
      filter(Boolean)
    );
  }

  ngOnInit() {
    this.playerDetails$.subscribe(details => {
      this.playerDetails = details;
    });
    this.player$.subscribe(player => {
      this.player = player;
    });
  }

  toMatches() {
    this.navCtrl.push(Tab1Root);
  }
}
