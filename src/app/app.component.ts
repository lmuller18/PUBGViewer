import { Component, ViewChild, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Nav, Platform, App, ViewController } from 'ionic-angular';

import { FirstRunPage, LoginPage } from '../pages/pages';
import { Settings } from '../providers/providers';
import { AuthService } from '../services/auth.service';

import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import * as fromViewer from '../store';
import { filter } from 'rxjs/operators';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Home', component: 'WelcomePage' },
    { title: 'Search', component: 'SearchPage' }
  ];

  private app;
  private platform;
  player$: Observable<any>;

  constructor(
    platform: Platform,
    settings: Settings,
    app: App,
    private auth: AuthService,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private store: Store<fromViewer.ViewerState>
  ) {
    this.app = app;
    this.platform = platform;
    this.initializeApp();
  }

  ngOnInit() {
    this.player$ = this.store.pipe(
      select(fromViewer.getPlayer),
      filter(Boolean)
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.registerBackButtonAction(() => {
        let nav = this.app.getActiveNav();
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

  getDisplayValue() {
    if (this.auth) {
      if (this.auth.getName()) {
        return this.auth.getName();
      } else if (this.auth.getEmail()) {
        return this.auth.getEmail();
      }
    }

    return 'PUBG Viewer';
  }

  logout() {
    this.auth.signOut();
    this.nav.setRoot(FirstRunPage);
  }

  login() {
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
