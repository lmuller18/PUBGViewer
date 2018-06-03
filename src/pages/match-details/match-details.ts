import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import * as fromViewer from '../../store';
import { filter } from 'rxjs/operators';
import { LoadMatch } from '../../store';
@IonicPage()
@Component({
  selector: 'page-match-details',
  templateUrl: 'match-details.html'
})
export class MatchDetailsPage implements OnInit {
  telemetry$: Observable<any>;
  telemetry: any;
  match: any;
  segment = 'details';
  teamPanelState = [];
  enemyPanelState = [];
  loaded = false;

  mapName: string;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.match = navParams.get('match');
    this.match.team.teammates.forEach((teammate, i) => {
      this.teamPanelState.push(false);
    });
    const map = this.match.map === 'Desert_Main' ? 'miramar' : 'erangel';
    this.mapName = `../../assets/img/pubg-assests/${map}_minimap_small.jpg`;
    const teammateNames = this.match.team.teammates.map(
      teammate => teammate.stats.name
    );
    const teammates = teammateNames.join('|');
    let enemies = null;
    if (this.match.enemies && this.match.enemies.teammates) {
      this.match.enemies.teammates.forEach((teammate, i) => {
        this.enemyPanelState.push(false);
      });
      const enemyNames = this.match.enemies.teammates.map(
        teammate => teammate.stats.name
      );
      enemies = enemyNames.join('|');
    }
    this.loaded = true;
    this.store.dispatch(
      new LoadMatch({
        teammates,
        enemies,
        telemUrl: this.match.telemUrl
      })
    );
    this.telemetry$ = this.store.pipe(
      select(fromViewer.getMatchTelemetry),
      filter(Boolean)
    );
  }

  ngOnInit() {
    this.telemetry$.subscribe(telemetry => {
      this.telemetry = telemetry;
    });
  }
}
