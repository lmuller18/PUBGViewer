import { Component } from "@angular/core";
import { IonicPage, NavController, ToastController } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";
import * as fromViewer from "../../store";
import { filter, take } from "rxjs/operators";

import { LoadPlayer, LoadMatches } from "../../store";

// import { MainPage } from "../pages";
import { MainPage } from "../pages";

@IonicPage()
@Component({
  selector: "page-search",
  templateUrl: "search.html"
})
export class SearchPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type

  notFound: boolean;
  searchForm: FormGroup;
  player$: Observable<any>;
  playerNotFound$: Observable<boolean>;
  // Our translated text strings
  // private signupErrorString: string;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private store: Store<fromViewer.ViewerState>
  ) {
    // this.translateService.get("SIGNUP_ERROR").subscribe(value => {
    // this.signupErrorString = value;
    // });
    this.searchForm = this.formBuilder.group({
      username: ["", Validators.required],
      platform: ["", Validators.required],
      region: ["", Validators.required]
    });
    this.playerNotFound$ = this.store.pipe(
      select(fromViewer.getPlayerNotFound),
      filter(Boolean)
    );
    this.player$ = this.store.pipe(
      select(fromViewer.getPlayer),
      filter(Boolean),
      take(1)
    );
  }

  search() {
    this.store.dispatch(new LoadPlayer(this.searchForm.value));
    this.playerNotFound$.subscribe(notFound => {
      let toast = this.toastCtrl.create({
        message: "Player was not found",
        duration: 3000,
        position: "top"
      });

      toast.present();
    });
    this.player$.subscribe((player: any) => {
      const matches: Array<any> = player.matches;
      this.store.dispatch(
        new LoadMatches({
          platform: this.platform,
          region: this.region,
          matches
        })
      );
      this.navCtrl.push(MainPage);
    });
  }

  formValid() {
    return this.searchForm.dirty && this.searchForm.valid;
  }

  get username() {
    return this.searchForm.get("username");
  }

  get platform() {
    return this.searchForm.get("platform");
  }

  get region() {
    return this.searchForm.get("region");
  }
}
