import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  headers: HttpHeaders;
  loading: Loading;

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.headers = new HttpHeaders()
      .set('Accept', 'application/vnd.api+json')
      .set(
        'Authorization',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyYzI4Njg1MC0xOGNmLTAxMzYtZTdjMy0wMzMxODI1NzdmN2YiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTIyNjkyNjgyLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1Ymctdmlld2VyIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MTB9.-W2PdClWJoDPNuSp1lA-45YPZkQLCGJbLiZOD5ouZ6s'
      );

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
        return this.http
          .get<any>(
            `http://pubgapi.lmuller.me/api/matches?matches=${
              params.matches
            }&platform=${params.platform}&region=${params.region}&playerId=${
              params.playerId
            }`
          )
          .pipe(
            map(value => {
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
