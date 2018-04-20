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
import { ToastController, Loading } from 'ionic-angular';

export interface MatchResponse {
  match: any;
}

@Injectable()
export class MatchEffects {
  loading: Loading;

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private toastCtrl: ToastController
  ) {}

  @Effect()
  loadMatch$: Observable<Action> = this.actions$
    .ofType(MatchActionTypes.LoadMatch)
    .pipe(
      map((action: LoadMatch) => action.payload),
      switchMap((params: any) => {
        return this.http
          .get<any>(
            `https://pubgapi.lmuller.me/api/telemetry?uri=${
              params.telemUrl
            }&teammates=${params.teammates}`
          )
          .pipe(
            map(value => {
              return new LoadMatchSuccess(value);
            }),
            catchError(error => {
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
