import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { StoreModule } from '@ngrx/store';
import { reducers, effects } from '../store';
import { EffectsModule } from '@ngrx/effects';

import { PUBGViewer } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firebaseConfig } from '../firebaseConfig';

import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [PUBGViewer],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(PUBGViewer),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    StoreModule.forFeature('viewer', reducers),
    EffectsModule.forFeature(effects),
    AngularFireModule.initializeApp(firebaseConfig.fire),
    AngularFirestoreModule.enablePersistence(),
    MatCardModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [PUBGViewer],
  providers: [
    Camera,
    InAppBrowser,
    SplashScreen,
    StatusBar,
    AuthService,
    AngularFireAuth,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
