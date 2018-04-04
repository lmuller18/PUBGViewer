import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Actions, Effect } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import {
  PlayerActionTypes,
  LoadPlayer,
  LoadPlayerSuccess,
  LoadPlayerFailure
} from "../actions/player.actions";
import { Observable } from "rxjs/Observable";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

export interface PlayerResponse {
  player: any;
}

@Injectable()
export class PlayerEffects {
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
  loadPlayer$: Observable<Action> = this.actions$
    .ofType(PlayerActionTypes.LoadPlayer)
    .pipe(
      map((action: LoadPlayer) => action.payload),
      switchMap((player: any) => {
        console.log("Load Player: ", player);
        return this.http
          .get<any>(
            `https://api.playbattlegrounds.com/shards/${player.platform}-${
              player.region
            }/players?filter[playerNames]=${player.username}`,
            { headers: this.headers }
          )
          .pipe(
            map(value => {
              console.log("Loading Player Done", value.data[0]);
              return new LoadPlayerSuccess(value.data[0]);
            }),
            catchError(error => {
              console.log("Error Loading Player: ", error);
              return of(new LoadPlayerFailure(error));
            })
          );
      })
    );
}
