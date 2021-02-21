import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
//import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CommonComponentsModule } from './common/common.module';
import { HomeComponent } from './home/home.component';


import { FCM } from '@ionic-native/fcm/ngx'
import { PlanComparisonComponent } from './plan-comparison/plan-comparison.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MonthlySavingsComponent } from './monthly-savings/monthly-savings.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterUserComponent } from './pages/initial-screens/register-user/register-user.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalPageModule } from './modal/modal.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SplashScreen } from '@capacitor/core';
import { IonicStorageModule } from '@ionic/storage';

export function socialConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('174475890475329')
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('455316244979-739mhai4ru3br3l24fpc3jhgre4eqau2.apps.googleusercontent.com')
      }
    ]
  );
  return config;
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
  entryComponents: [HomeComponent, RegisterUserComponent],
  imports: [
    BrowserModule, 
    CommonComponentsModule, 
    IonicModule, 
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
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
    PreviewAnyFile,
    File,
    SocialSharing,
    { provide: Window, useValue: window },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AuthServiceConfig, useFactory: socialConfigs },
    FCM,
    // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent, HomeComponent, PlanComparisonComponent, MonthlySavingsComponent]
})
export class AppModule { }
