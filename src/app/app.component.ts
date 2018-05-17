import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Nav, Platform, App, ViewController } from 'ionic-angular';

import { FirstRunPage } from '../pages/pages';
import { Settings } from '../providers/providers';
import { AuthService } from '../services/auth.service';
import { LoginPage } from '../pages/login/login';

@Component({
  template: `<ion-menu [content]="content">
  <ion-header>
    <ion-toolbar>
      <ion-title>Pages</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
        {{p.title}}
      </button>
    </ion-list>
  </ion-content>

</ion-menu>
  <ion-nav [color]="'primary'" #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Search', component: 'SearchPage' },
    { title: 'Player', component: 'PlayerPage' }
  ];

  constructor(
    private platform: Platform,
    settings: Settings,
    app: App,
    private auth: AuthService,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      platform.registerBackButtonAction(() => {
        let nav = app.getActiveNav();
        let activeView: ViewController = nav.getActive();

        if (activeView != null) {
          if (nav.canGoBack()) {
            nav.pop();
          } else if (
            typeof activeView.instance.backButtonAction === 'function'
          ) {
            activeView.instance.backButtonAction();
          } else {
            nav.parent.select(0); // goes to the first tab
          }
        }
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
