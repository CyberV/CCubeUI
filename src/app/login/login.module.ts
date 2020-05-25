import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { CommonComponentsModule } from '../common/common.module';

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
    LoginFormComponent
  ]
})
export class LoginModule {}
