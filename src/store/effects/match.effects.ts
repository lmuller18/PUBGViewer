import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  MatchActionTypes,
  LoadMatch,
  LoadMatchSuccess,
  LoadMatchFailure
} from '../actions/match.actions';
import { Observable } from 'rxjs/Observable';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ToastController, LoadingController, Loading } from 'ionic-angular';

export interface MatchResponse {
  match: any;
}

@Injectable()
export class MatchEffects {
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
      content: 'Loading Additional Match Data...'
    });
  }

  dismissLoader() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  @Effect()
  loadMatch$: Observable<Action> = this.actions$
    .ofType(MatchActionTypes.LoadMatch)
    .pipe(
      map((action: LoadMatch) => action.payload),
      switchMap((params: any) => {
        if (!this.loading) {
          this.loading = this.createLoader();
        }

        this.loading.present();

        return this.http
          .get<any>(
            `https://pubgapi.lmuller.me/api/telemetry?uri=${
              params.telemUrl
            }&teammates=${params.teammates}&enemies=${params.enemies}`
          )
          .pipe(
            map(value => {
              this.dismissLoader();
              return new LoadMatchSuccess(value);
            }),
            catchError(error => {
              this.dismissLoader();
              let toast = this.toastCtrl.create({
                message: 'Error Loading Match Telemetry',
                duration: 3000,
                position: 'top'
              });

              toast.present();

              return of(new LoadMatchFailure(error));
            })
          );
      })
    );
}
