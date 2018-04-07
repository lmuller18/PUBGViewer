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
  LoadMatchesSuccess
} from "../actions/matches.actions";
import { Observable } from "rxjs/Observable";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import * as fromViewer from "../../store";
import { LoadingController, Loading } from "ionic-angular";

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
    private loadingCtrl: LoadingController
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
      map((params: any) => {
        if (!this.loading) {
          this.loading = this.createLoader();
        }
        this.loading.present();
        return new LoadExternalMatch({
          region: params.region,
          platform: params.platform,
          matches: params.matches,
          number: 0
        });
      })
    );

  @Effect()
  loadMatch$: Observable<Action> = this.actions$
    .ofType(MatchesActionTypes.LoadExternalMatch)
    .pipe(
      map((action: LoadExternalMatch) => action.payload),
      switchMap((match: any) => {
        return this.http
          .get<any>(
            `https://api.playbattlegrounds.com/shards/${match.platform}-${
              match.region
            }/matches/${match.matches[match.number].id}`,
            { headers: this.headers }
          )
          .pipe(
            map(value => {
              this.store.dispatch(new LoadExternalMatchSuccess(value));

              const matchesToSearch = 8;
              if (
                match.number + 1 < match.matches.length &&
                match.number < matchesToSearch
              ) {
                const newParams = {
                  region: match.region,
                  platform: match.platform,
                  id: match.id,
                  matches: match.matches,
                  number: (match.number += 1)
                };

                return new LoadExternalMatch(newParams);
              } else {
                if (this.loading) {
                  this.loading.dismiss();
                  this.loading = null;
                }
                return new LoadMatchesSuccess();
              }
            }),
            catchError(error => {
              if (this.loading) {
                this.loading.dismiss();
                this.loading = null;
              }
              return of(new LoadExternalMatchFailure(error));
            })
          );
      })
    );
}
