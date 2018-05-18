import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainPage } from '../../pages/pages';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  PlayerActionTypes,
  LoadPlayer,
  LoadPlayerSuccess,
  LoadPlayerFailure,
  LoadSeasons,
  LoadSeasonsSuccess,
  LoadPlayerDetails,
  LoadPlayerDetailsSuccess
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

  createLoader(message?): Loading {
    const content = message || 'Searching Player...';
    return this.loadingCtrl.create({
      content: content
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
            `https://pubgapi.lmuller.me/api/player/${player.username.trim()}?region=${
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
                this.app.getActiveNav().setRoot(MainPage);
              }
              return [
                new LoadPlayerSuccess(value.player),
                new LoadSeasons(value.player)
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

  @Effect()
  loadSeasons$: Observable<Action> = this.actions$
    .ofType(PlayerActionTypes.LoadSeasons)
    .pipe(
      map((action: LoadPlayer) => action.payload),
      switchMap((player: any) => {
        if (!this.loading) {
          this.loading = this.createLoader('Loading Player Details');
        }

        this.loading.present();
        return this.http
          .get<any>(
            `https://pubgapi.lmuller.me/api/seasons?platform=${
              player.platform
            }&region=${player.region}`
          )
          .pipe(
            concatMap(value => {
              const currentSeason = value.seasons.find(
                season => season.attributes.isCurrentSeason
              );
              return [
                new LoadSeasonsSuccess(value.seasons),
                new LoadPlayerDetails({
                  platform: player.platform,
                  region: player.region,
                  playerId: player.id,
                  season: {
                    id: currentSeason.id,
                    isCurrent: true
                  }
                })
              ];
            }),
            catchError(error => {
              if (this.loading) {
                this.loading.dismiss();
                this.loading = null;
              }
              let toast = this.toastCtrl.create({
                message: 'Seasons were not found',
                duration: 3000,
                position: 'top'
              });

              toast.present();
              return of(new LoadPlayerFailure(error));
            })
          );
      })
    );

  @Effect()
  loadPlayerDetails$: Observable<Action> = this.actions$
    .ofType(PlayerActionTypes.LoadPlayerDetails)
    .pipe(
      map((action: LoadPlayer) => action.payload),
      switchMap((player: any) => {
        if (!this.loading) {
          this.loading = this.createLoader('Loading Player Details');
        }

        this.loading.present();
        return this.http
          .get<any>(
            `https://pubgapi.lmuller.me/api/player-details/${
              player.playerId
            }?region=${player.region}&platform=${player.platform}&season=${
              player.season.id
            }&current=${player.season.isCurrent}`
          )
          .pipe(
            map(value => {
              if (this.loading) {
                this.loading.dismiss();
                this.loading = null;
              }
              return new LoadPlayerDetailsSuccess(value.stats);
            }),
            catchError(error => {
              if (this.loading) {
                this.loading.dismiss();
                this.loading = null;
              }
              let toast = this.toastCtrl.create({
                message: 'Player details were not found',
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
