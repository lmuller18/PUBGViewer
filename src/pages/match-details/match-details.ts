import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-match-details',
  templateUrl: 'match-details.html'
})
export class MatchDetailsPage {
  match: any;

  constructor(public navCtrl: NavController, navParams: NavParams) {
    this.match = navParams.get('match');
  }
}
