import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { CommonComponentsModule } from '../common/common.module';
import { SigninFormComponent } from './signin-form/signin-form.component';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    CommonComponentsModule
  ],
  declarations: [
    LoginPage,
    LoginComponent,
    LoginFormComponent,
    SigninFormComponent
  ],
  providers: [
    Geolocation,
    NativeGeocoder
  ]
})
export class LoginModule {}
