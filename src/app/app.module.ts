import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicStorageModule } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EventsapiProvider } from '../providers/eventsapi/eventsapi';
import { FavoriteProvider } from '../providers/favorite/favorite';
import { EventDetailsPage } from '../pages/event-details/event-details';
import { Geolocation } from '@ionic-native/geolocation'
import { SocialSharing } from '@ionic-native/social-sharing';





@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EventDetailsPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      driverOrder: [CordovaSQLiteDriver._driver, 'indexeddb', 'websql', 'localstorage']
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EventDetailsPage
  ],
  providers: [
    StatusBar,
    Geolocation,
    SocialSharing,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    EventsapiProvider,
    FavoriteProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
