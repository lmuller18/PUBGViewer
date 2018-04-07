import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MainPage } from "../../pages/pages";

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
import { ToastController, App, LoadingController } from "ionic-angular";

export interface PlayerResponse {
  player: any;
}

@Injectable()
export class PlayerEffects {
  headers: HttpHeaders;

  constructor(
    private app: App,
    private http: HttpClient,
    private actions$: Actions,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
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
        let loading = this.loadingCtrl.create({
          content: "Searching Player..."
        });

        loading.present();
        return this.http
          .get<any>(
            `https://api.playbattlegrounds.com/shards/${player.platform}-${
              player.region
            }/players?filter[playerNames]=${player.username}`,
            { headers: this.headers }
          )
          .pipe(
            map(value => {
              loading.dismiss();
              console.log("Loading Player Done", value.data[0]);
              if (this.app.getActiveNav().parent) {
                this.app.getActiveNav().parent.select(0);
              } else {
                this.app.getActiveNav().push(MainPage);
              }
              return new LoadPlayerSuccess(value.data[0]);
            }),
            catchError(error => {
              loading.dismiss();
              let toast = this.toastCtrl.create({
                message: "Player was not found",
                duration: 3000,
                position: "top"
              });

              toast.present();
              return of(new LoadPlayerFailure(error));
            })
          );
      })
    );
}
