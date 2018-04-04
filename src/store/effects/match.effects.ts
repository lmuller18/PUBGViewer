import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Actions, Effect } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import {
  MatchActionTypes,
  LoadMatch,
  LoadMatchSuccess,
  LoadMatchFailure,
  LoadMatches,
  LoadMatchesSuccess,
  LoadMatchesFailure,
  SetUpMatches
} from "../actions/match.actions";
import { Observable } from "rxjs/Observable";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import * as fromViewer from "../../store";

export interface MatchResponse {
  match: any;
}

@Injectable()
export class MatchEffects {
  headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<fromViewer.ViewerState>
  ) {
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
        console.log("Loading All Matches: ", params);
        return of(
          params.matches.every((match, i) => {
            if (i === 5) return false;
            let next = params.matches[i + 1].id;
            if (i === 4) next = null;
            params.matches[i] = { ...match, next };
            return true;
          })
        ).pipe(
          map(value => {
            console.log("load matches value: ", params.matches);
            this.store.dispatch(
              new LoadMatch({
                region: params.region,
                platform: params.platform,
                matches: params.matches,
                number: 0
              })
            );
            return new SetUpMatches(value);
          }),
          catchError(error => {
            console.log("Error Loading All Matches");
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
        console.log("Loading Match: ", match);
        return this.http
          .get<any>(
            `https://api.playbattlegrounds.com/shards/${match.platform}-${
              match.region
            }/matches/${match.matches[match.number].id}`,
            { headers: this.headers }
          )
          .pipe(
            map(value => {
              console.log("Loading Match Done", value);
              this.store.dispatch(new LoadMatchSuccess(value));

              if (match.number < 5) {
                const newParams = {
                  region: match.region,
                  platform: match.platform,
                  id: match.id,
                  matches: match.matches,
                  number: (match.number += 1)
                };

                console.log("NEW PARAMS: ", newParams);

                return new LoadMatch(newParams);
              } else {
                return new LoadMatchesSuccess(value);
              }
            }),
            catchError(error => {
              console.log("Error Loading Match: ", error);
              return of(new LoadMatchFailure(error));
            })
          );
      })
    );
}
