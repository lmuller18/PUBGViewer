import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import * as fromViewer from '../../store';

import { LoadPlayer } from '../../store';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  notFound: boolean;
  searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromViewer.ViewerState>,
    public auth: AuthService
  ) {
    this.searchForm = this.formBuilder.group({
      username: ['', Validators.required],
      platform: ['', Validators.required],
      default: [this.getIsUserPlayer()],
    });
  }

  search() {
    this.store.dispatch(new LoadPlayer(this.searchForm.value));
  }

  searchMe() {
    this.store.dispatch(new LoadPlayer(this.auth.getUserPlayer()));
  }

  formValid() {
    return this.searchForm.dirty && this.searchForm.valid;
  }

  getIsUserPlayer() {
    const userPlayer = this.auth.getUserPlayer();
    return (
      userPlayer !== undefined &&
      this.searchForm !== undefined &&
      this.formValid() &&
      userPlayer.username === this.username.value &&
      userPlayer.platform === this.platform.value
    );
  }

  get username() {
    return this.searchForm.get('username');
  }

  get platform() {
    return this.searchForm.get('platform');
  }

  get default() {
    return this.searchForm.get('default');
  }
}
