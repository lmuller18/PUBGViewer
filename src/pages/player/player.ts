import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import * as fromViewer from '../../store';
import { filter } from 'rxjs/operators';
import { Tab1Root } from '../pages';
import { LoadPlayerDetails, LoadMatches } from '../../store';
import { AuthService } from '../../services/auth.service';

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
  seasons$: Observable<any>;
  seasons: any[];
  segment = undefined;
  season: any;

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    private store: Store<fromViewer.ViewerState>,
    private cf: ChangeDetectorRef
  ) {
    this.playerDetails$ = this.store.pipe(
      select(fromViewer.getPlayerDetails),
      filter(Boolean)
    );
    this.player$ = this.store.pipe(
      select(fromViewer.getPlayer),
      filter(Boolean)
    );
    this.seasons$ = this.store.pipe(
      select(fromViewer.getSeasons),
      filter(Boolean)
    );
  }

  ngOnInit() {
    this.seasons$.subscribe(seasons => {
      this.seasons = this.formatSeasons(seasons);
      this.season = this.seasons.find(
        season => season.attributes.isCurrentSeason
      );
      this.segment = this.season.id;
    });
    this.player$.subscribe(player => {
      this.player = player;
    });
    this.playerDetails$.subscribe(details => {
      const formattedDetails = [];
      formattedDetails.push({ key: 'Solo', ...details['solo'] });
      formattedDetails.push({ key: 'Solo - FPP', ...details['solo-fpp'] });
      formattedDetails.push({ key: 'Duo', ...details['duo'] });
      formattedDetails.push({ key: 'Duo - FPP', ...details['duo-fpp'] });
      formattedDetails.push({ key: 'Squad', ...details['squad'] });
      formattedDetails.push({ key: 'Squad - FPP', ...details['squad-fpp'] });
      this.playerDetails = formattedDetails;
    });
  }

  formatSeasons(seasons): any[] {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    const filtered = seasons
      .map(season => {
        const fullName = season.id.split('.')[3].split('-');
        let secondName = fullName[1];
        if (/^[0-9][0-9]$/.test(secondName)) {
          secondName = monthNames[parseInt(secondName) - 1];
        }
        return {
          ...season,
          verbose: `${secondName} ${fullName[0]}`
        };
      })
      .reverse();

    return filtered;
  }

  changeSeason(id) {
    this.season = this.seasons.find(season => season.id === id);
    this.segment = id;
    this.store.dispatch(
      new LoadPlayerDetails({
        playerId: this.player.id,
        platform: this.player.platform,
        region: this.player.region,
        season: {
          id: this.season.id,
          isCurrent: this.season.attributes.isCurrentSeason
        }
      })
    );
  }

  segmentChanged() {
    this.cf.detectChanges();
  }

  toMatches() {
    const matchesNumbers = this.player.matches.map(match => match.id);
    const matchesString = matchesNumbers.join('|');
    this.store.dispatch(
      new LoadMatches({
        platform: this.player.platform,
        region: this.player.region,
        matches: matchesString,
        playerId: this.player.id
      })
    );
    this.navCtrl.push(Tab1Root);
  }
}
