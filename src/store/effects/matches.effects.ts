import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  MatchesActionTypes,
  LoadMatches,
  LoadMatchesSuccess,
  LoadMatchesFailure
} from '../actions/matches.actions';
import { Observable } from 'rxjs/Observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ToastController, LoadingController, Loading } from 'ionic-angular';

export interface MatchesResponse {
  matches: any;
}

@Injectable()
export class MatchesEffects {
  loading: Loading;

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loading = this.createLoader();
  }

  createLoader(): Loading {
    return this.loadingCtrl.create({
      content: 'Loading Matches...'
    });
  }

  @Effect()
  loadMatches$: Observable<Action> = this.actions$
    .ofType(MatchesActionTypes.LoadMatches)
    .pipe(
      map((action: LoadMatches) => action.payload),
      switchMap((params: any) => {
        if (!this.loading) {
          this.loading = this.createLoader();
        }

        this.loading.present();
        return this.http
          .get<any>(
            `https://pubgapi.lmuller.me/api/matches?matches=${
              params.matches
            }&platform=${params.platform}&region=${params.region}&playerId=${
              params.playerId
            }`
          )
          .pipe(
            map(value => {
              if (this.loading) {
                this.loading.dismiss();
                this.loading = null;
              }
              return new LoadMatchesSuccess(value.matches);
            }),
            catchError(error => {
              if (this.loading) {
                this.loading.dismiss();
                this.loading = null;
              }
              let toast = this.toastCtrl.create({
                message: 'Error Loading Matches',
                duration: 3000,
                position: 'top'
              });

              toast.present();

              return of(new LoadMatchesFailure(error));
            })
          );
      })
    );
}
