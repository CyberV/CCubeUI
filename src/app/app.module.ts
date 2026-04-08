import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { TooltipsModule } from 'ionic4-tooltips';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { PreviewAnyFile } from '@awesome-cordova-plugins/preview-any-file/ngx';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CommonComponentsModule } from './common/common.module';
import { HomeComponent } from './home/home.component';


import { FCM } from '@awesome-cordova-plugins/fcm/ngx';
import { PlanComparisonComponent } from './plan-comparison/plan-comparison.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MonthlySavingsComponent } from './monthly-savings/monthly-savings.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterUserComponent } from './pages/initial-screens/register-user/register-user.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalPageModule } from './modal/modal.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonicStorageModule } from '@ionic/storage-angular';
import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever/ngx';
import { OfflineHttpInterceptor } from './services/offline.interceptor';
import { OfflineService } from './services/offline.service';
import { TelemetryService } from './services/telemetry.service';
import { TelemetryErrorHandler } from './services/telemetry-error.handler';
import { ThemeService } from './services/theme.service';
import { ErrorHandler } from '@angular/core';

export function socialConfigs(): SocialAuthServiceConfig {
  return {
    autoLogin: false,
    providers: [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('174475890475329')
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('455316244979-739mhai4ru3br3l24fpc3jhgre4eqau2.apps.googleusercontent.com')
      }
    ],
    onError: (err) => { console.error(err); }
  };
}

@NgModule({

  declarations: [
    AppComponent, 
    HomeComponent, 
    PlanComparisonComponent, 
    MonthlySavingsComponent,
    RegisterUserComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    CommonComponentsModule,
    IonicModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    TooltipsModule.forRoot(),
    AppRoutingModule,
    SocialLoginModule,
    HttpClientModule,
    TooltipModule,
    FormsModule,
    ModalPageModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxIonicImageViewerModule
  ],
  providers: [
    FileChooser,
    FileOpener,
    FilePath,
    SmsRetriever,
    PreviewAnyFile,
    File,
    SocialSharing,
    { provide: Window, useValue: window },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: 'SocialAuthServiceConfig', useFactory: socialConfigs },
    FCM,
    AppComponent,
    // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

    // Offline Mode – see docs/06-additional-insights.md §5
    OfflineService,
    { provide: HTTP_INTERCEPTORS, useClass: OfflineHttpInterceptor, multi: true },

    // N7 – Telemetry (see docs/06-additional-insights.md §7)
    TelemetryService,
    { provide: ErrorHandler, useClass: TelemetryErrorHandler },

    // N8 – Theme / Dark mode (see docs/06-additional-insights.md §8)
    ThemeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
