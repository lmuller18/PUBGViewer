import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Actions, Effect } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import {
  MatchActionTypes,
  LoadMatch,
  LoadMatchSuccess,
  LoadMatchFailure,
  LoadMatches,
  LoadMatchesSuccess,
  LoadMatchesFailure
} from "../actions/match.actions";
import { Observable } from "rxjs/Observable";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

export interface MatchResponse {
  match: any;
}

@Injectable()
export class MatchEffects {
  headers: HttpHeaders;

  constructor(private http: HttpClient, private actions$: Actions) {
    this.headers = new HttpHeaders()
      .set("Accept", "application/vnd.api+json")
      .set(
        "Authorization",
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyYzI4Njg1MC0xOGNmLTAxMzYtZTdjMy0wMzMxODI1NzdmN2YiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTIyNjkyNjgyLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InB1Ymctdmlld2VyIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MTB9.-W2PdClWJoDPNuSp1lA-45YPZkQLCGJbLiZOD5ouZ6s"
      );
  }

  @Effect()
  loadMatches$: Observable<Action> = this.actions$
    .ofType(MatchActionTypes.LoadMatches)
    .pipe(
      map((action: LoadMatches) => action.payload),
      switchMap((params: any) => {
        return of(
          params.matches.every((match, i) => {
            if (i === 5) return false;
            return new LoadMatch({
              platform: params.platform,
              region: params.region,
              id: match.id
            });
          })
        ).pipe(
          map(value => {
            return new LoadMatchesSuccess(value);
          }),
          catchError(error => {
            return of(new LoadMatchesFailure(error));
          })
        );
      })
    );

  @Effect()
  loadMatch$: Observable<Action> = this.actions$
    .ofType(MatchActionTypes.LoadMatch)
    .pipe(
      map((action: LoadMatch) => action.payload),
      switchMap((match: any) => {
        return this.http
          .get<any>(
            `https://api.playbattlegrounds.com/shards/${match.platform}-${
              match.region
            }/matches/${match.id}`,
            { headers: this.headers }
          )
          .pipe(
            map(value => {
              console.log("done", value);
              return new LoadMatchSuccess(value);
            }),
            catchError(error => {
              console.log("error", error);
              return of(new LoadMatchFailure(error));
            })
          );
      })
    );
}
