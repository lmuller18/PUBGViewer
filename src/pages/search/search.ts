import { Component } from "@angular/core";
import { IonicPage } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import { Store } from "@ngrx/store";
import * as fromViewer from "../../store";

import { LoadPlayer } from "../../store";

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
  // player$: Observable<any>;
  // Our translated text strings
  // private signupErrorString: string;

  constructor(
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
    // this.player$ = this.store.pipe(
    //   select(fromViewer.getPlayer),
    //   filter(Boolean)
    // );
  }

  search() {
    this.store.dispatch(new LoadPlayer(this.searchForm.value));
    // this.player$.subscribe((player: any) => {
    //   const matches: Array<any> = player.matches;
    //   this.store.dispatch(
    //     new LoadMatches({
    //       platform: this.platform,
    //       region: this.region,
    //       matches
    //     })
    //   );
    // });
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
