import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
 */
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  constructor(public navCtrl: NavController, public auth: AuthService) {}

  login() {
    this.navCtrl.push('LoginPage');
  }

  searchPlayer() {
    this.navCtrl.push('SearchPage');
  }
}
