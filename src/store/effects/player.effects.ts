import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainPage } from '../../pages/pages';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  PlayerActionTypes,
  LoadPlayer,
  LoadPlayerSuccess,
  LoadPlayerFailure
} from '../actions/player.actions';
import { Observable } from 'rxjs/Observable';
import { switchMap, map, concatMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import {
  ToastController,
  App,
  LoadingController,
  Loading
} from 'ionic-angular';
import { LoadMatches } from '../actions/matches.actions';

export interface PlayerResponse {
  player: any;
}

@Injectable()
export class PlayerEffects {
  loading: Loading;

  constructor(
    private app: App,
    private http: HttpClient,
    private actions$: Actions,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.loading = this.createLoader();
  }

  createLoader(): Loading {
    return this.loadingCtrl.create({
      content: 'Searching Player...'
    });
  }

  @Effect()
  loadPlayer$: Observable<Action> = this.actions$
    .ofType(PlayerActionTypes.LoadPlayer)
    .pipe(
      map((action: LoadPlayer) => action.payload),
      switchMap((player: any) => {
        if (!this.loading) {
          this.loading = this.createLoader();
        }

        this.loading.present();
        return this.http
          .get<any>(
            `http://pubgapi.lmuller.me/api/player/${player.username}?region=${
              player.region
            }&platform=${player.platform}`
          )
          .pipe(
            concatMap(value => {
              if (this.loading) {
                this.loading.dismiss();
                this.loading = null;
              }
              if (this.app.getActiveNav().parent) {
                this.app.getActiveNav().parent.select(0);
              } else {
                this.app.getActiveNav().push(MainPage);
              }
              const matchesNumbers = value.player.matches.map(
                match => match.id
              );
              const matchesString = matchesNumbers.join('|');
              return [
                new LoadPlayerSuccess(value.player),
                new LoadMatches({
                  platform: player.platform,
                  region: player.region,
                  matches: matchesString,
                  playerId: value.player.id
                })
              ];
            }),
            catchError(error => {
              if (this.loading) {
                this.loading.dismiss();
                this.loading = null;
              }
              let toast = this.toastCtrl.create({
                message: 'Player was not found',
                duration: 3000,
                position: 'top'
              });

              toast.present();
              return of(new LoadPlayerFailure(error));
            })
          );
      })
    );
}
