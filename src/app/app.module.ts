import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CommonComponentsModule } from './common/common.module';
import { HomeComponent } from './home/home.component';

import { PlanComparisonComponent } from './plan-comparison/plan-comparison.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MonthlySavingsComponent } from './monthly-savings/monthly-savings.component';

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
    MonthlySavingsComponent 
  ],
  entryComponents: [HomeComponent],
  imports: [
    BrowserModule, 
    CommonComponentsModule, 
    IonicModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    SocialLoginModule, 
    HttpClientModule, 
    TooltipModule
  ],
  providers: [
    { provide: Window, useValue: window },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AuthServiceConfig, useFactory: socialConfigs },
    // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent,HomeComponent, PlanComparisonComponent, MonthlySavingsComponent]
})
export class AppModule { }
