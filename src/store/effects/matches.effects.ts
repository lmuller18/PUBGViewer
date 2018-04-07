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

export interface MatchesResponse {
  matches: any;
}

@Injectable()
export class MatchesEffects {
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
    .ofType(MatchesActionTypes.LoadMatches)
    .pipe(
      map((action: LoadMatches) => action.payload),
      map((params: any) => {
        console.log("Loading Matches: ", params);
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
              this.store.dispatch(new LoadExternalMatchSuccess(value));

              // const matchesToSearch = 4;
              const matchesToSearch = 1;
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

                console.log("NEW PARAMS: ", newParams);

                return new LoadExternalMatch(newParams);
              } else {
                console.log("Loading Matches Done");
                return new LoadMatchesSuccess();
              }
            }),
            catchError(error => {
              console.log("Error Loading Match: ", error);
              return of(new LoadExternalMatchFailure(error));
            })
          );
      })
    );
}
