import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Actions, Effect } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import {
  MatchesActionTypes,
  LoadExternalMatch,
  LoadExternalMatchSuccess,
  LoadExternalMatchFailure,
  LoadMatches,
  LoadMatchesSuccess,
  LoadMatchesFailure
} from "../actions/matches.actions";
import { Observable } from "rxjs/Observable";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import * as fromViewer from "../../store";
import { ToastController, LoadingController, Loading } from "ionic-angular";

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
    private store: Store<fromViewer.ViewerState>,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.headers = new HttpHeaders()
      .set("Accept", "application/vnd.api+json")
      .set(
        "Authorization",
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyYzI4Njg1MC0xOGNmLTAxMzYtZTdjMy0wMzMxODI1NzdmN2YiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTIyNjkyNjgyLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1Ymctdmlld2VyIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MTB9.-W2PdClWJoDPNuSp1lA-45YPZkQLCGJbLiZOD5ouZ6s"
      );

    this.loading = this.createLoader();
  }

  createLoader(): Loading {
    return this.loadingCtrl.create({
      content: "Loading Matches..."
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
        const matchesToSearch = 8;

        this.loading.present();

        return of(
          params.matches.forEach((match, index) => {
            if (index < matchesToSearch) {
              this.store.dispatch(
                new LoadExternalMatch({
                  region: params.region,
                  platform: params.platform,
                  match
                })
              );
            }
          })
        ).pipe(
          map(value => {
            if (this.loading) {
              this.loading.dismiss();
              this.loading = null;
            }
            return new LoadMatchesSuccess();
          }),
          catchError(error => {
            if (this.loading) {
              this.loading.dismiss();
              this.loading = null;
            }
            let toast = this.toastCtrl.create({
              message: "Error Loading Matches",
              duration: 3000,
              position: "top"
            });
            toast.present();
            return of(new LoadMatchesFailure(error));
          })
        );
      })
    );

  @Effect()
  loadMatch$: Observable<Action> = this.actions$
    .ofType(MatchesActionTypes.LoadExternalMatch)
    .pipe(
      map((action: LoadExternalMatch) => action.payload),
      mergeMap((params: any) => {
        return this.http
          .get<any>(
            `https://api.playbattlegrounds.com/shards/${params.platform}-${
              params.region
            }/matches/${params.match.id}`,
            { headers: this.headers }
          )
          .pipe(
            map(value => {
              return new LoadExternalMatchSuccess(value);
            }),
            catchError(error => {
              if (this.loading) {
                this.loading.dismiss();
                this.loading = null;
              }
              let toast = this.toastCtrl.create({
                message: "Error Loading Matches",
                duration: 3000,
                position: "top"
              });

              toast.present();

              return of(new LoadExternalMatchFailure(error));
            })
          );
      })
    );
}
