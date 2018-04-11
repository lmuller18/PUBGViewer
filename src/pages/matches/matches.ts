import { Component, OnInit } from "@angular/core";
import { IonicPage, ToastController, NavController } from "ionic-angular";

import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";
import * as fromViewer from "../../store";
import { filter } from "rxjs/operators";
import { LoadMatches } from "../../store";

@IonicPage()
@Component({
  selector: "page-matches",
  templateUrl: "matches.html"
})
export class MatchesPage implements OnInit {
  player$: Observable<any>;
  player: any;
  matches$: Observable<any[]>;

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.player$ = this.store.pipe(
      select(fromViewer.getPlayer),
      filter(Boolean)
    );
    this.matches$ = this.store.pipe(
      select(fromViewer.getMatches),
      filter(Boolean)
    );
  }

  ngOnInit() {
    this.player$.subscribe(player => {
      this.player = player;
    });
  }

  loadMatches(refresher) {
    this.store.dispatch(
      new LoadMatches({
        platform: this.player.platform,
        region: this.player.region,
        matches: this.player.matches
      })
    );
    refresher.complete();
  }

  // openMatch(match: any) {
  //   this.navCtrl.push("MatchPage", {
  //     match: match
  //   });
  // }
}
