import { Component } from "@angular/core";
import { IonicPage, NavController, ToastController } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";
import * as fromViewer from "../../store";
import { LoadPlayer, LoadMatches } from "../../store";

// import { MainPage } from "../pages";
import { filter } from "rxjs/operators";

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
  matches$: Observable<any>;
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
    this.player$ = this.store.pipe(
      select(fromViewer.getPlayer),
      filter(Boolean)
    );
    this.matches$ = this.store.pipe(
      select(fromViewer.getMatches),
      filter(Boolean)
    );
  }

  search() {
    console.log(this.searchForm.value);
    this.store.dispatch(new LoadPlayer(this.searchForm.value));
    this.player$.subscribe((player: any) => {
      console.log(player);
      const matches: Array<any> = player.relationships.matches.data;
      this.store.dispatch(
        new LoadMatches({
          platform: this.platform,
          region: this.region,
          matches
        })
      );
    });
    this.matches$.subscribe((match: any) => {
      console.log(match);
    });

    // this.player.search(this.searchForm.value).subscribe(
    //   (resp: any) => {
    //     const matches: Array<any> = resp.data[0].relationships.matches.data;
    //     this.match
    //       .get(this.searchForm.value, matches)
    //       .subscribe((matchResponse: any) => {});
    //   },
    //   err => {
    //     this.username.setErrors({ notFound: true });
    //   }
    // );
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
