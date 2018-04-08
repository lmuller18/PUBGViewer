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
  notFound: boolean;
  searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.searchForm = this.formBuilder.group({
      username: ["", Validators.required],
      platform: ["", Validators.required],
      region: ["", Validators.required]
    });
  }

  search() {
    this.store.dispatch(new LoadPlayer(this.searchForm.value));
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
